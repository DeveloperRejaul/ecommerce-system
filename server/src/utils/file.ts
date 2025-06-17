import { createWriteStream, existsSync } from 'fs';
import {unlink}  from'node:fs/promises';
// import {v2, UploadApiResponse} from 'cloudinary';
import { join } from 'path';
import { random } from './random';
import { IFileType } from 'src/types';



export const uploadToCloudinary = async (file:IFileType)  => {
  // const res:UploadApiResponse = await new Promise((resolve) => v2.uploader.upload_stream((error, uploadResult) => resolve(uploadResult)).end(file.buffer));
  // console.log(res);
  // return res.url;
  
  return saveFile(file);
};

export const deleteToCloudinary = async (id:string) => {
  await deleteFile(id);
//  return v2.uploader.destroy(id, {resource_type:'image'});
};


export const saveFile = (file: IFileType) => {
  const ext = file.originalname.split('.').pop();
  const fileName = `${random()}.${ext}`;
  const uploadPath = join(process.cwd(), 'upload', fileName);
  const writeStream = createWriteStream(uploadPath);

  return new Promise((resolve, reject) => {
      writeStream.write(file.buffer, (error) => {
        if (error) {
          reject(false);
        } else {
          writeStream.end(() => {
            resolve(fileName);
          });
        }
      });
    },
  );
};



export const deleteFile = async (path:string) => {
  const filePath = join(process.cwd(),  'upload', path);
   if(existsSync(filePath)) await unlink(filePath);
};