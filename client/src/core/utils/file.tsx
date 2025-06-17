import { BASE_URL } from '../constants/constants';

export const urlConvert = (url:string) => {
  if (url.includes('http')) return url;
  return `${BASE_URL}/file/${url}`;
};
