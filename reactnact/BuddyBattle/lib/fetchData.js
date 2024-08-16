

  
const { Client, Account, Databases } = require('appwrite');
const fs = require('fs');

const config = {
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

// Initialiser le client Appwrite
const client = new Client();
client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
;
// Authentifier l'utilisateur
const account = new Account(client);

(async () => {
    try {
        await account.createEmailPasswordSession('menahem.nicolas@gmail.com', '12341234'); // Remplacez par les identifiants de votre utilisateur

        // Initialiser le service des bases de données
        const databases = new Databases(client);
        const databaseId = config.databaseId; // Remplacez par votre ID de base de données
        const collectionId = config.photoCollectionId ; // Remplacez par votre ID de collection

        // Récupérer les documents
        const result = await databases.listDocuments(databaseId, collectionId);

        // Écrire les données dans un fichier
        const filePath = 'data.json';
        fs.writeFileSync(filePath, JSON.stringify(result.documents, null, 2));

        console.log(`Les données ont été écrites dans le fichier ${filePath}`);
    } catch (error) {
        console.error('Erreur lors de la récupération ou de l\'écriture des documents:', error);
    }
})();
