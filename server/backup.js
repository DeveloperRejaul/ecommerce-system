/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require('fs');
const {google} = require('googleapis');
const apiKey = require('./google.json');
const { exec } = require('child_process');
const cron = require('node-cron');
const path = require('path');


/**
 * Authenticates with Google Drive API using a service account.
 * 
 * This function creates a JWT client with the necessary scope for Google Drive,
 * authorizes it using the provided API key, and returns the authenticated client.
 *
 * @async
 * @function auth
 * @returns {Promise<google.auth.JWT>} A promise that resolves to the authenticated JWT client.
 * @throws {Error} If authentication fails.
 */
async function auth() {
    const SCOPE = ['https://www.googleapis.com/auth/drive.file'];
    const JWTClient = new google.auth.JWT(apiKey.client_email, null, apiKey.private_key, SCOPE);
    await  JWTClient.authorize();
    return JWTClient;
}



/**
 * Uploads a file to Google Drive.
 *
 * @async
 * @function uploadFile
 * @returns {Promise<void>}
 * @throws Will throw an error if the file upload fails.
 */
async function uploadFile(filePath) {
    try {
        console.log('Authorizing..');
        const authClient = await auth();
        const drive = google.drive({version: 'v3', auth: authClient});

        /**
         * @type {google.drive.v3.Schema$File}
         * @property {string} name - The name of the file.
         * @property {string[]} parents - The IDs of the parent folders.
         */
        const fileMetadata = {
            name: filePath.split('/').pop(),
            parents: ['1ckP0Qug6WaT-F2DK5WB9Tdy9piL6aK2r'],
        };

        /**
         * @type {google.drive.v3.Schema$Media}
         * @property {fs.ReadStream} body - The file content to be uploaded.
         * @property {string} mimetype - The MIME type of the file.
         */
        const media = {
            media: {
                body: fs.createReadStream(filePath),
            },
            mimetype: 'application/sql',
        };

        /**
         * @type {google.drive.v3.Params$FilesCreate}
         * @property {google.drive.v3.Schema$File} resource - The metadata for the file.
         * @property {google.drive.v3.Schema$Media} media - The media to be uploaded.
         * @property {string} fields - Selector specifying which fields to include in a partial response.
         */
        console.log('uploading..');
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        console.log(`File uploaded with ID: ${response.data.id}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}




// handle export db file
async function exportDbFile  () {
    const dbUser = 'nestuser';
    const dbHost = 'postgres';
    const dbName = 'nestdb';
    const dbPassword = 'nestpassword';
    const dbPort = '5432';

    const outputFile = path.join( '..','backups' ,`backup_${new Date().toISOString().split('T')[0]}-${Date.now()}.sql`);
    const command = `PGPASSWORD=${dbPassword} pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -F c -b -v -f ${outputFile} ${dbName}`;


   await new Promise((resolve , reject)=> {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error exporting database: ${error.message}`);
                reject();
                return;
            }
            if (stderr) {
                console.error(`pg_dump stderr: ${stderr}`);
            }
            console.log(`Database exported successfully to ${outputFile}`);
            resolve();
        });
   });
   return outputFile;
}


// main function
(async()=>{
    cron.schedule('0 0 * * *', async () => {
        try {
          const filePath =  await exportDbFile();
          console.log(filePath);
          
           if (filePath) {
               await uploadFile(filePath);
               fs.unlinkSync(filePath);
           }
        } catch (error) {
            console.log(error);
        }
      });
})();