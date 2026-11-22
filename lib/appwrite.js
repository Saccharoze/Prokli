// Everything the app asks the Appwrite backend: accounts, the database (users, photos, defis)
// and the storage bucket for photos and avatars.
import { Account, Avatars, Client, Databases, ID, Permission, Query, Role, Storage } from 'react-native-appwrite';
import * as FileSystem from 'expo-file-system';

// Values come from .env (see .env.example). Expo only inlines EXPO_PUBLIC_* variables
// written out in full, so each one is spelled out here.
const env = {
  EXPO_PUBLIC_APPWRITE_ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  EXPO_PUBLIC_APPWRITE_DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  EXPO_PUBLIC_APPWRITE_PHOTO_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_PHOTO_COLLECTION_ID,
  EXPO_PUBLIC_APPWRITE_DEFI_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_DEFI_COLLECTION_ID,
  EXPO_PUBLIC_APPWRITE_STORAGE_ID: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
};
const missing = Object.keys(env).filter((name) => !env[name]);
if (missing.length) {
  throw new Error(`Missing in .env: ${missing.join(', ')} (copy .env.example to .env and fill it in)`);
}

export const config = {
  endpoint: env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  photoCollectionId: env.EXPO_PUBLIC_APPWRITE_PHOTO_COLLECTION_ID,
  defiCollectionId: env.EXPO_PUBLIC_APPWRITE_DEFI_COLLECTION_ID,
  storageId: env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
};

// Must match the Android package and iOS bundle identifier in app.json,
// and a platform registered in the Appwrite project.
const PLATFORM = 'com.prokli.app';

// A posted photo stays open for votes this long, then settlePost() closes it.
const VOTE_WINDOW_SECONDS = 60;

// A photo reported this many times is deleted.
const MAX_REPORTS = 10;

const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(PLATFORM);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

const db = {
  list: (collection, queries) => databases.listDocuments(config.databaseId, collection, queries),
  get: (collection, id) => databases.getDocument(config.databaseId, collection, id),
  update: (collection, id, data) => databases.updateDocument(config.databaseId, collection, id, data),
  remove: (collection, id) => databases.deleteDocument(config.databaseId, collection, id),
};

// --- Accounts and the player's document

export const login = (email, password) => account.createEmailPasswordSession(email, password);

export const logout = () => account.deleteSession('current');

// A new player: the Appwrite account, a session, then the player's document (readable by everyone,
// so the leaderboard can show it) with an initials picture as avatar.
export const registerPlayer = async ({ email, password, username }) => {
  const { $id: accountId } = await account.create(ID.unique(), email, password, username);
  await login(email, password);
  const avatar = avatars.getInitials(username);
  return databases.createDocument(
    config.databaseId,
    config.userCollectionId,
    ID.unique(),
    { accountId, email, username, avatar },
    [Permission.read(Role.any())],
  );
};

// The signed-in player's document, or null without a session.
export const fetchPlayer = async () => {
  const session = await account.get().catch(() => null);
  if (!session) return null;
  const { documents } = await db.list(config.userCollectionId, [Query.equal('accountId', session.$id)]);
  return documents[0] ?? null;
};

export const getAllUsers = async () => {
  const result = await db.list(config.userCollectionId, [Query.orderDesc('points')]);
  return result.documents;
};

// --- Files

const MIME_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', heic: 'image/heic', heif: 'image/heif' };

// Uploads a local file (photo or avatar) and returns its public view URL.
const uploadFile = async (uri) => {
  const name = uri.split('/').pop();
  const extension = name.split('.').pop().toLowerCase();
  const { size } = await FileSystem.getInfoAsync(uri);

  const file = await storage.createFile(config.storageId, ID.unique(), {
    name,
    type: MIME_TYPES[extension] ?? 'application/octet-stream',
    size,
    uri,
  });
  return storage.getFileView(config.storageId, file.$id);
};

export const updateAvatar = async (userId, uri) => {
  const avatar = await uploadFile(uri);
  return db.update(config.userCollectionId, userId, { avatar });
};

// --- Challenges (defis) and photos

// The challenges of a category that the user has not posted a photo for yet.
export const getOpenChallenges = async (userId, categorie) => {
  const [defis, userPhotos] = await Promise.all([
    db.list(config.defiCollectionId, [Query.orderAsc('points'), Query.equal('categorie', categorie)]),
    db.list(config.photoCollectionId, [Query.equal('users', userId)]),
  ]);
  const done = new Set(userPhotos.documents.map((photo) => photo.title));
  return defis.documents.filter((defi) => !done.has(defi.name));
};

export const createPost = async ({ title, uri, points, userId }) => {
  const photo = await uploadFile(uri);
  const post = await databases.createDocument(config.databaseId, config.photoCollectionId, ID.unique(), {
    title,
    photo,
    users: userId,
    points,
    valide: 0,
    refuse: 0,
    done: false,
  });
  return post.$id;
};

export const searchPosts = async (query) => {
  const result = await db.list(config.photoCollectionId, [Query.search('title', query)]);
  return result.documents;
};

// The user's photos that passed the vote.
export const getUserPosts = async (userId) => {
  const result = await db.list(config.photoCollectionId, [
    Query.orderDesc('$createdAt'),
    Query.equal('users', userId),
    Query.equal('done', true),
  ]);
  return result.documents;
};

// --- Votes and reports

// The 10 latest photos, minus those the user already voted on or reported.
export const getNotVotedPosts = async (userId) => {
  const [posts, user] = await Promise.all([
    db.list(config.photoCollectionId, [Query.orderDesc('$createdAt'), Query.limit(10)]),
    db.get(config.userCollectionId, userId),
  ]);
  return posts.documents.filter(
    (post) =>
      !post.usersphotosvoted.some((voter) => voter.$id === userId) &&
      !user.reported.some((reported) => reported.$id === post.$id),
  );
};

// The 15 latest photos the user voted on.
export const getVotedPosts = async (userId) => {
  const user = await db.get(config.userCollectionId, userId);
  return [...(user.photosvoted ?? [])].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).slice(0, 15);
};

// Records the signed-in user's vote. valide and refuse are the new totals.
// photo.usersphotosvoted and user.photosvoted are the two sides of one relationship:
// adding the user on the photo side fills the user side too.
export const vote = async (postId, valide, refuse) => {
  const user = await fetchPlayer();
  if (!user) throw new Error('Connecte toi pour voter');

  const post = await db.get(config.photoCollectionId, postId);
  const voters = post.usersphotosvoted ?? [];
  if (voters.some((voter) => voter.$id === user.$id)) return;

  await db.update(config.photoCollectionId, postId, {
    usersphotosvoted: [...voters.map((voter) => voter.$id), user.$id],
    valide,
    refuse,
  });
};

// Closes the vote on a photo: accepted (valide >= refuse) gives its points to the author,
// refused deletes it.
const settlePost = async (postId) => {
  const post = await db.get(config.photoCollectionId, postId);

  if (post.valide >= post.refuse) {
    const author = await db.get(config.userCollectionId, post.users.$id);
    await db.update(config.photoCollectionId, postId, { done: true });
    await db.update(config.userCollectionId, author.$id, { points: author.points + post.points });
  } else {
    await db.remove(config.photoCollectionId, postId);
  }
};

// Settles every photo whose vote window is over. Runs in the app when the home feed is refreshed.
export const closeExpiredVotes = async () => {
  const open = await db.list(config.photoCollectionId, [Query.equal('done', false)]);
  const expired = open.documents.filter(
    (post) => (Date.now() - new Date(post.$createdAt)) / 1000 > VOTE_WINDOW_SECONDS,
  );
  await Promise.allSettled(expired.map((post) => settlePost(post.$id)));
};

export const reportPost = async (postId, userId) => {
  const [post, user] = await Promise.all([
    db.get(config.photoCollectionId, postId),
    db.get(config.userCollectionId, userId),
  ]);
  const reports = post.reports + 1;

  if (reports >= MAX_REPORTS) {
    await db.remove(config.photoCollectionId, postId);
  } else {
    const reported = (user.reported ?? []).map((photo) => photo.$id);
    await db.update(config.userCollectionId, userId, { reported: [...reported, postId] });
    await db.update(config.photoCollectionId, postId, { reports });
  }
};

// --- Teams

export const setTeam = (userId, team) => db.update(config.userCollectionId, userId, { team });

// Points per team (sum of its members' points), lowest first.
export const getTeamRanking = async () => {
  const result = await db.list(config.userCollectionId);
  const points = { montagne: 0, ocean: 0, soleil: 0 };
  result.documents.forEach((user) => {
    if (user.team in points) points[user.team] += user.points;
  });
  return Object.entries(points)
    .map(([team, total]) => ({ team, points: total }))
    .sort((a, b) => a.points - b.points);
};
