import * as dotenv from 'dotenv';
import PubSubApiClient from 'salesforce-pubsub-api-client';
import fs from 'fs';

dotenv.config();

let clientInstance = null;

async function connectClient() {
    if (clientInstance) {
        return clientInstance; // Return existing client if already connected
    }

    //Development: uses simple Username/password flow
    if(process.env.NODE_ENV !== 'PROD'){         
         console.log('Running with Development client');
        clientInstance = new PubSubApiClient({
            authType: 'username-password',
            loginUrl: process.env.SALESFORCE_LOGIN_URL,
            username: process.env.SALESFORCE_USERNAME,
            password: process.env.SALESFORCE_PASSWORD,
            userToken: process.env.SALESFORCE_TOKEN
        });
    }   

    // Production : uses OAuth 2.0 JWT bearer flow
    if(process.env.NODE_ENV === 'PROD'){       
        console.log('Running with Production client'); 
        const privateKey = fs.readFileSync(process.env.SALESFORCE_PRIVATE_KEY_FILE);        
        clientInstance = new PubSubApiClient({
            authType: 'oauth-jwt-bearer',
            loginUrl: process.env.SALESFORCE_LOGIN_URL,
            clientId: process.env.SALESFORCE_JWT_CLIENT_ID,
            username: process.env.SALESFORCE_USERNAME,
            privateKey
        });
    }
    

    await clientInstance.connect(); // Connect client if not connected
    return clientInstance;
}

export default connectClient;
