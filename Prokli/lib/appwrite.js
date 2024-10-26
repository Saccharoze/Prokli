import { Alert } from 'react-native';
import { Account, Avatars, Client, Databases, ID, Permission, Query ,Role,Storage } from 'react-native-appwrite';
import * as FileSystem from 'expo-file-system';
import {images} from '../constants'


export const config = {
  endpoint: 'https://cloud.appwrite.io/v1' ,
  platform:'com.jsm.prokli' ,
  projectId:'6662bec10034ae4bfb69' ,
  databaseId:'6662c5f8002587bd078a' ,
  userCollectionId:'667bc9bb000fe853aafc' ,
  photoCollectionId:'667bcaa600100d69da13' ,
  defiCollectionId:'667bcad9000f533d6e7d',
  albumCollectionId:'66759105001fd66dfe8d' ,
  storageId:'6662cbd4000da5dd8c05' ,
  
};



// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client) ;
    const storage = new Storage(client) ;

export const createUser = async (email, password , 
username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email, 
            password,
            username,
        );
        
        if (!newAccount) throw Error ;
        
        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId ,
            ID.unique() , 
            {
                accountId: newAccount.$id ,
                email,
                username,
                avatar: avatarUrl
            }  ,
            [
                Permission.read(Role.any()),                  // Anyone can view this document
                
            ]
        ) ;
        return newUser;
    } catch (error) {
        console.log(error) ;
        throw new Error(error);
    }
}

export const signIn = async (email,password) => {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        )

        return session ;
    } catch (error) {
        Alert.alert('Votre email ou votre mot de passe est incorrect')
        throw new Error(error) ;
    }
}

export const signOut = async () => {
  try {
      const session = await account.deleteSession('current') ;

      return session ;
      
  } catch (error) {
      throw new Error(error)
  }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get() ;
        if (!currentAccount) throw Error ;

        const currentUser = await databases.listDocuments(
            config.databaseId ,
            config.userCollectionId ,
            [Query.equal('accountId' , currentAccount.$id)]
        )

        if (!currentUser) throw Error ;

        

        return currentUser.documents[0] ;

    } catch (error) {
        console.log(error) ;
        return null ;
        
    }
    
}

export const getAllUsers = async () => {
  try {
      const posts = await databases.listDocuments(
          config.databaseId,
          config.userCollectionId ,
          [Query.orderDesc('points')]
      )
      //console.log('heyyy' , posts.documents)
      return posts.documents;  

  } catch (error) {
    throw new Error(error) ;
  }
  
}




export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.photoCollectionId ,
            [Query.orderDesc('$createdAt')]
        )
        
        const posts2 = posts.documents.filter(doc => doc.done === false)
        //console.log(posts2)
        console.log(posts2)
        if(posts2.length !== 0) {
          //console.log(posts2)
          posts2.forEach(doc => {

            const dif = Date.now() - (new Date(doc.$createdAt)) ;
            //console.log(dif/1000)
            if((dif/1000) > 60) {
              deleteDefi(doc.$id)
            }
          });  
        }
        

    } catch (error) {
      throw new Error(error) ;
    }
    
  }

export const getAllDefis = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.defiCollectionId,
           
        )
        //console.log('heyyy' , posts.documents)
        return posts.documents;  

    } catch (error) {
      throw new Error(error) ;
    }
    
  }


export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.photoCollectionId,
            [Query.orderDesc('$createdAt') , Query.limit(7)]
        )

        return posts.documents;

    } catch (error) {
      throw new Error(error) ;
    }
  }



export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.photoCollectionId,
            [Query.search('title' , query)]
        )

        return posts.documents;

    } catch (error) {
      throw new Error(error) ;
    }
  }



export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            
            config.databaseId,
            config.photoCollectionId,
            [
              Query.orderDesc('$createdAt') , 
              Query.equal('users' , userId) ,
              Query.equal('done' , true) ,
            ]
            

        )

        //console.log(posts.documents)
    
        return posts.documents;

    } catch (error) {
      throw new Error(error) ;
    }
  }

  export const getDefiPhotos = async (userId) => {
    try {
        const posts = await databases.getDocument(
            
            config.databaseId,
            config.userCollectionId,
            userId
        )
    
        return posts.defiphotos;

    } catch (error) {
      throw new Error(error) ;
    }
  }


  export const getNotMadeDefi = async (userId , categorie) => {
    try {
      // Récupérer les défis
      const defiPosts = await databases.listDocuments(
        config.databaseId,
        config.defiCollectionId,
        [Query.orderAsc('points') , Query.equal('categorie' , categorie)]
      );
  
      // Récupérer les photos de l'utilisateur
      const userPhotos = await databases.listDocuments(      
        config.databaseId,
        config.photoCollectionId,
        [Query.equal('users', userId)]
      );
  
      // Extraire les noms des photos de l'utilisateur
      const userPhotoNames = userPhotos.documents.map(photo => photo.title);
      
      //console.log(userPhotoNames)
      
      // Filtrer les défis pour exclure ceux dont les noms sont dans les noms des photos de l'utilisateur
      const filteredDefis = defiPosts.documents.filter(defi => !userPhotoNames.includes(defi.name));

      //console.log(filteredDefis)

  
      return filteredDefis;
    } catch (error) {
      throw new Error(error);
    }
  };
  


  export const getVotedPosts = async (userId) => {
    try {
      const userDocument = await databases.getDocument(
        config.databaseId,
        config.userCollectionId,
        userId ,
      );
  
      if (!userDocument || !userDocument.photosvoted || !Array.isArray(userDocument.photosvoted)) {
        throw new Error('No voted posts found for the user.');
      }
  
      const votedPosts = userDocument.photosvoted.sort((a, b) => {
        return new Date(b.$createdAt) - new Date(a.$createdAt);
      });
      
      return votedPosts.slice(0,15);
    } catch (error) {
      throw new Error(error);
    }
  }
  

  export const getNotVotedPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            
            config.databaseId,
            config.photoCollectionId,
            [Query.orderDesc('$createdAt') , Query.limit(10)]

        )
        const user = await databases.getDocument(
          config.databaseId ,
          config.userCollectionId ,
          userId
        )
        
        //console.log(user.reported[0])
        //console.log(posts.documents[0].$id)
        //console.log(user.reported.includes(posts.documents[0].$id))
        //console.log(posts.documents[0].usersphotosvoted[0].$id === userId)
        //console.log(posts.documents[0].usersphotosvoted)

        return posts.documents.filter(doc => !doc.usersphotosvoted.some(vote => vote.$id === userId) 
                                          && !user.reported.some(report => report.$id === doc.$id));
    } catch (error) {
      throw new Error(error) ;
    }
  }



export const getFilePreview = async (fileId , type) => {
    let fileUrl ;

    try {
        if (type === 'image') {
            fileUrl = storage.getFileView(config.storageId , fileId)
        } else if (type === 'image2') {
            fileUrl = storage.getFilePreview(config.storageId , fileId  ,'top' , 100)
        }
    } catch (error) {
        throw new Error('Fichier invalide') ;
    }

    if(!fileUrl) throw Error ;

    return fileUrl ;
}

const getFileInfo = async (uri) => {
  const info = await FileSystem.getInfoAsync(uri);
  return {
      name: uri.split('/').pop(), // Extract file name from URI
      type: 'image/gribouille', // Example: set MIME type manually based on file type
      size: info.size,
      uri: uri,
  };
};


export const uploadFile = async (fileUri, type) => {
  if (!fileUri) return;

  try {
      const fileInfo = await getFileInfo(fileUri);

      const uploadedFile = await storage.createFile(
          config.storageId,
          ID.unique(),
          {
              name: fileInfo.name,
              type: fileInfo.type,
              size: fileInfo.size,
              uri: fileInfo.uri,
          }
      );
      //console.log(uploadedFile)
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
  } catch (error) {
      throw new Error(error.message);
  }
};


export const createVideo = async (form) => {
    try {
        //console.log(form)
        const [photoUrl] = await Promise.all([
            uploadFile(form.form.image , 'image') ,
        ])

        console.log(form)
        //console.log(form.form.image)
        const newPost = await databases.createDocument(
            config.databaseId , 
            config.photoCollectionId , 
            ID.unique() ,
            {
                title: form.form.title ,
                photo : photoUrl ,
                users : form.form.userId ,
                points : form.form.points ,
                valide: 0,
                refuse: 0 ,
                done : false
            }
        )

        console.log(newPost)

        
        //console.log(newPost)
        return newPost.$id ;

    } catch (error) {
        throw new Error(error) ;
    }
}



export const updateIntegers = async (documentId, newValue1, newValue2) => {
    //console.log('voting')
    try {

        const user = await getCurrentUser();
        if (!user) {
          throw new Error('User not authenticated');
        }
        
    // Récupérer le document actuel pour obtenir l'état actuel du tableau usersphotosvoted
    const document = await databases.getDocument(
        config.databaseId,
        config.photoCollectionId,
        documentId
      );

      //console.log('voting')

      // Ajouter l'ID de l'utilisateur au tableau s'il n'est pas déjà présent
      const updatedUsersPhotosVoted = document.usersphotosvoted || [];
      //console.log(updatedUsersPhotosVoted.some(doc => doc.$id === user.$id))
      if (!updatedUsersPhotosVoted.some(doc => doc.$id === user.$id)) {
        updatedUsersPhotosVoted.push(user.$id);
      } else return console.log('Tu as déjà voté') ;
  
      // Mettre à jour le document avec le tableau modifié
      await databases.updateDocument(
        config.databaseId,
        config.photoCollectionId,
        documentId,
        {
          usersphotosvoted: updatedUsersPhotosVoted
        }
      );
  
      // Mettre à jour le document de l'utilisateur avec l'ID du document s'il n'est pas déjà présent
      const userDocument = await databases.getDocument(
        config.databaseId,
        config.userCollectionId,
        user.$id
      );
  
      const updatedPhotosVoted = userDocument.photosvoted || [];
      
      

        
      await databases.updateDocument(
        config.databaseId,
        config.userCollectionId,
        user.$id,
        {
          photosvoted: updatedPhotosVoted
        }
      );



      const response = await databases.updateDocument(
        config.databaseId, // Votre ID de base de données
        config.photoCollectionId, // Votre ID de collection
        documentId, // ID du document à mettre à jour
        {
          valide: newValue1, // Mettre à jour la valeur du premier entier
          refuse: newValue2,  // Mettre à jour la valeur du deuxième entier
     
        }
      );

      
      console.log('Document updated successfully:');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };




export const deleteDefi = async (photoId) => {

  try {

   
    //console.log(user.$id)
    //console.log(defiId)
    
    const photoDocument = await databases.getDocument(
      config.databaseId,
      config.photoCollectionId,
      photoId
    );

    const user = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      photoDocument.users.$id ,
      
    )
    const updatedPoints = user.points + photoDocument.points
    
    console.log(photoDocument.users.$id)
    
    //console.log(photoDocument)
    //console.log(photoDocument.refuse)

    if (photoDocument.valide >= photoDocument.refuse) {
      
      await databases.updateDocument(
        config.databaseId,
        config.photoCollectionId,
        photoId ,
        {
          done : true
        }
      )
      await databases.updateDocument(
        config.databaseId,
        config.userCollectionId,
        photoDocument.users.$id ,
        {
          points : updatedPoints
        }
      )
    } else {
      const document = await databases.getDocument(
        config.databaseId,
        config.photoCollectionId,
        photoId
      );

      if (document) {
        await databases.deleteDocument(
          config.databaseId,
          config.photoCollectionId,
          photoId
        );
      }
    }
    //Alert.alert('Succès' , 'Défi supprimé !')
    console.log('Défi supprimé !');
  } catch (error) {
    console.error('Error updating document:', error);

  }

}



// Upload File
export async function uploadAvatar(file, type) {
  if (!file) return;

  

  try {
    const fileInfo = await getFileInfo(file);

      const uploadedFile = await storage.createFile(
          config.storageId,
          ID.unique(),
          {
              name: fileInfo.name,
              type: fileInfo.type,
              size: fileInfo.size,
              uri: fileInfo.uri,
          }
      );
    console.log('UPLOADED' , uploadedFile)

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getAvatarPreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function updateAvatar(form) {
  try {
    console.log('FORM' , form.form.userId)

    const [imageUrl] = await Promise.all([
      uploadAvatar(form.form.uri, "image"),
    ]);

    console.log('teeeeest' , form.form.imageUrl)
    const newPost = await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      form.form.userId,
      {
        avatar : imageUrl
      }
    );

    return newPost;
  } catch (error) {
    return console.log('appwrite.js/updateAvatar' , error);
  }
}


export const teamChosen = async (userId , categorie) => {
  try {

    await databases.updateDocument(
      config.databaseId ,
      config.userCollectionId ,
      userId ,
      {
        team : categorie
      }
    )
    console.log('HEY')
    return ;
  } catch (error) {
    throw new Error(error);
  }
}


export const getRank = async () =>  {
  try {
    const posts = await databases.listDocuments(
      config.databaseId ,
      config.userCollectionId ,      
    )

    let rank = [ [0 , images.terre ] , [0 , images.ocean ] , [0 , images.soleil ]] ; 

    posts.documents.forEach(doc => {
      if (doc.team === 'montagne') rank[0][0] = rank[0][0] + doc.points
      if (doc.team === 'ocean') rank[1][0] = rank[1][0] + doc.points
      if (doc.team === 'soleil') rank[2][0] = rank[2][0] + doc.points
    })

    rank.sort((a, b) => {
      return a[0] - b[0];
    });

    return rank ;
  } catch (error) {
    throw new Error(error);
  }
}

export const reportDefi = async (photoId , userId) => {
  console.log(photoId) ;
  console.log(userId) ;
  try {
    const photo = await databases.getDocument(
      config.databaseId ,
      config.photoCollectionId ,
      photoId
    )
  
    const user = await databases.getDocument(
      config.databaseId ,
      config.userCollectionId ,
      userId
    )
  
    const updatedReported = user.reported || []
    updatedReported.push(photoId)
    const updatedReports = photo.reports + 1;
    
  
    if (updatedReports >= 10) {
      await databases.deleteDocument(
        config.databaseId ,
        config.photoCollectionId ,
        photoId
      )
    } else {
      await databases.updateDocument(
        config.databaseId ,
        config.userCollectionId ,
        userId ,
        {
          reported : updatedReported
        }
      )
      await databases.updateDocument(
        config.databaseId ,
        config.photoCollectionId ,
        photoId ,
        {
          reports : updatedReports
        }
      )
    }
    
    return Alert.alert('La vidéo a bien été signalé !') ;
  } catch (error) {
    throw new Error(error) ;
  }





}