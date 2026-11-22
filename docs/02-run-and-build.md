# Run and build

The app is on Expo SDK 51 and needs an Appwrite project set up as in
[The Appwrite backend](01-appwrite-backend.md).

## Run

```sh
npm ci
cp .env.example .env      # then fill it in, see the table
npx expo start
```

| Variable in `.env` | Where to find it in the Appwrite console |
|---|---|
| `EXPO_PUBLIC_APPWRITE_ENDPOINT` | project settings, API endpoint (`https://cloud.appwrite.io/v1` on Appwrite Cloud) |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | project settings |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | Databases, the database |
| `EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID` | the `users` collection's settings |
| `EXPO_PUBLIC_APPWRITE_PHOTO_COLLECTION_ID` | the `photos` collection's settings |
| `EXPO_PUBLIC_APPWRITE_DEFI_COLLECTION_ID` | the `defis` (challenges) collection's settings |
| `EXPO_PUBLIC_APPWRITE_STORAGE_ID` | Storage, the bucket |

`.env` stays out of git. Expo builds the `EXPO_PUBLIC_` values into the app, so anyone with the app can read them:
they are IDs, not secrets. A missing value makes the app fail at startup with an error naming the variable.
Once running, the app opens on a welcome screen; create an account from the sign-in screen.

Expo Go only opens projects made for its own SDK version, so the store version won't open this one.
On an Android emulator, press `a` in `npx expo start`: Expo CLI installs Expo Go by itself.
Otherwise, build the APK below.

Before a commit: `npm run lint` (ESLint with Expo's rules) and `npm run format` (Prettier).

## Android build

The `preview` profile in `eas.json` makes an APK, a file you can install directly on a phone.
A local build needs Node, the Android SDK, NDK and a JDK, set up as in React Native's
[environment guide](https://reactnative.dev/docs/0.74/set-up-your-environment), and an Expo account:

```sh
npm install -g eas-cli
eas login
eas init                                   # creates the Expo project and adds its ID to app.json
set -a; . ./.env; set +a                   # load .env into the shell
eas build --platform android --profile preview --local --output prokli.apk
```

The build copies the project without the files git ignores, so it doesn't see `.env`: the `set -a` line puts the
values in the environment instead. Without it the APK builds, then fails at startup. The first build asks to
create a signing keystore; EAS keeps it in the Expo account.

For a build on Expo's servers (`eas build` without `--local`), store the variables as
[EAS environment variables](https://docs.expo.dev/eas/environment-variables/) instead.

Previous: [The Appwrite backend](01-appwrite-backend.md) · [All steps](../README.md#steps)
