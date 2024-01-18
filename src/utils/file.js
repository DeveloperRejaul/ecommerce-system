import path from 'path';
import fs from 'fs';
import setting from '../setting';

/**
 * @description this function create for deleting file from uploads directory
 * @param {string} fileName
 */
export const deleteUploadFile = (fileName) => { fs.unlink(path.join(setting.media.dir, fileName), (err) => console.log(err)); };

/**
 * @description this function using for file upload
 */
const fileDir = path.join(path.resolve(), setting.media.dir);
export const fileUp = async (file) => {
  try {
    // check file params data type object
    if (Array.isArray(file)) throw new Error('File must be an single object');

    // checking file dir exists
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);

    // checking file extension validity
    const ext = file.name.split(/\./).slice(-1)[0];
    if (!setting.media.extensions.includes(ext)) throw new Error('Invalid file extension');

    // making unique file path
    const fileName = (Date.now() * Math.random()) + file.name;
    const filePath = path.join(fileDir, fileName);
    if (fs.existsSync(filePath)) throw new Error('Invalid file name');

    // uploading file
    const buffer = fs.readFileSync(file.path);
    fs.writeFileSync(filePath, buffer);
    return { uri: fileName, name: file.fieldName };
  } catch (err) {
    console.error(err);
    throw new Error('Failed to save file.');
  }
};
