import path from 'path';
import fs from 'fs';
import { uploadsPath } from '../constants/constants';

/**
 * @description this function create for deleting file from uploads directory
 * @param {string} fileName
 */
export const deleteUploadFile = (fileName) => { fs.unlink(path.join(uploadsPath, fileName), (err) => console.log(err)); };
