/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import { BASE_URL } from '@/core/constant/constant';
import { toast } from '../hooks/use-toast';

export const urlToFile = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], url, { type: blob.type });
};

export const uploadFile = async (data:FormData):Promise<{url:string}> => {
  // Check file sizes
  for (const [, value] of data.entries()) {
    if (value instanceof File) {
      const fileSizeInKB = value.size / 1024; // Convert bytes to KB
      if (fileSizeInKB > 500) {
        toast({
          title: 'File size',
          description: 'One or more files exceed less then 500KB!',
        });
        return Promise.reject(new Error('One or more files exceed 500KB!'));
      }
    }
  }

  const res = await fetch(`${BASE_URL}/file/`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });

  return res.json();
};

export const uploadFiles = async (data:FormData):Promise<{urls:string[]}> => {
  // Check file sizes
  for (const [, value] of data.entries()) {
    if (value instanceof File) {
      const fileSizeInKB = value.size / 1024; // Convert bytes to KB
      if (fileSizeInKB > 500) {
        toast({
          title: 'File size',
          description: 'One or more files exceed less then 500KB!',
        });
        return Promise.reject(new Error('One or more files exceed 500KB!'));
      }
    }
  }

  const res = await fetch(`${BASE_URL}/files/`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });

  return res.json();
};

export const urlConvert = (url:string) => {
  if (url.includes('http')) return url;
  return `${BASE_URL}/file/${url}`;
};
