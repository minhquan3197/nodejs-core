import fs from 'fs';
import readline from 'readline';
import googleleapis from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const TOKEN_PATH = 'token.json';

const google = googleleapis.google;

// ID Folder
const FOLDER_ID = '';

export default class UploadFileServices {
    /**
     * This function is upload file to google drive
     * @param {*} auth
     * @param {*} dataFile
     */
    static async storeFiles(auth: any, dataFile: any) {
        const drive: any = google.drive({ version: 'v3', auth });

        let fileMetadata: any = {
            name: dataFile.name,
        };

        if (FOLDER_ID.length !== 0) {
            fileMetadata.parents = [FOLDER_ID];
        }

        let media = {
            mimeType: dataFile.type,
            body: fs.createReadStream(dataFile.path),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Remove file when uploaded file
        fs.unlinkSync(dataFile.path);

        // Return file ID google drive
        return file.data.id;
    }

    /**
     * This function if not have token, function create token
     * @param {*} oAuth2Client
     * @param {*} dataFile
     */
    static async createToken(oAuth2Client: any, dataFile: any) {
        // Generate Auth
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        console.log('Authorize this app by visiting this url:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        // Create token.json
        rl.question('Enter the code from that page here: ', code => {
            rl.close();
            oAuth2Client.getToken(code, async (err: any, token: any) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);

                fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                    if (err) return console.error(err);
                });
                return await this.storeFiles(oAuth2Client, dataFile);
            });
        });
    }

    /**
     * This is main function upload
     * @param {*} filePath
     * @param {*} mimeType
     * @param {*} fileName
     */
    static async uploadFile(filePath: any, mimeType: any, fileName: any) {
        let dataFile = {
            path: filePath,
            type: mimeType,
            name: fileName,
        };

        const credentials = await JSON.parse(fs.readFileSync('credentials.json').toString());
        const { client_secret, client_id, redirect_uris } = credentials.installed;

        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        let tokenPath;

        try {
            // Get file token.json by Token path
            tokenPath = await fs.readFileSync(TOKEN_PATH);
        } catch (error) {
            // If not file token.json create file
            return await this.createToken(oAuth2Client, dataFile);
        }

        // If have file token.json upload file
        oAuth2Client.setCredentials(JSON.parse(tokenPath.toString()));
        return await this.storeFiles(oAuth2Client, dataFile);
    }
}
