/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '../constants/constants';
import { animatedToast } from '../components/AnimatedToast';
import { color } from '../constants/color';

export class Utils {
  /**
   * @description This Function Using for get Number of Presents
   * @param discount
   * @param price
   * @returns Number
   */
  static getPresent(discount:number, price:number) {
    return Math.ceil((discount / price) * 100);
  }

  /**
   * @description This function using for parse Specification of product
   * main text format like this
   * @Sample Brand:Apple__Model:16 Pro__Type: Super Retina XDR Display__Size: 6.7 inches__Resolution: 2778 x 1284 pixels__Refresh Rate: 120Hz ProMotion technology__Brightness: Up to 2000 nits peak outdoor brightness__colors: #000,#fff,#ddd __size:s,m,l,xl,2xl,3xl,4xl
   * @param text string
   * @returns Object
   */
  static parseSpecification(text:string) {
    const items = text.split('__');
    const obj:{[key:string]: string} = {};
    items.forEach((ele) => {
      const item = ele.split(':');
      const [key, value] = item;
      obj[key] = value;
    });
    return obj;
  }

  /**
   * @description This function using for Upper case string fast letter
   * @param text string
   * @returns String
   */
  static fastLatterUpperCase(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
  }

  /**
   * @description This function using for file upload
   * @param text string
   * @returns String
   */

  static async uploadFile(file:ImagePicker.ImagePickerAsset | File, token:string) {
    const formData = new FormData();

    const maxFileSizeKB = 500; // Maximum file size in KB

    // Determine file size
    let fileSizeInKB: number = 0;

    if (file instanceof File) {
      fileSizeInKB = file.size / 1024; // Convert bytes to KB
    } else if ('fileSize' in file && file.fileSize) {
      fileSizeInKB = file.fileSize / 1024; // fileSize is in bytes
    } else {
      console.warn('File size could not be determined.');
    }

    // Check file size limit
    if (fileSizeInKB > maxFileSizeKB) {
      animatedToast.show({
        title: 'File size',
        message: 'One or more files exceed less then 500KB!',
        bgColor: color.error,
      });
      return Promise.reject(new Error(`File size exceeds ${maxFileSizeKB} KB limit!`));
    }

    if (file instanceof File) {
      formData.append('file', file);
    } else {
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.fileName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
    try {
      const res = await fetch(`${BASE_URL}/file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const json = await res.json();
      return json.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  static clearEmptyObject(obj: {[key:string]: any}) {
    const newObj:{[key:string]: any} = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== '') {
        newObj[key] = value;
      }
    }
    return newObj;
  }
}
