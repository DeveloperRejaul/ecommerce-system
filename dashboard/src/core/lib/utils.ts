/* eslint-disable no-restricted-syntax */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { toast } from '../hooks/use-toast';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeEachWord(str: string) {
  const arrayOfStr = str.split('_');

  return arrayOfStr
    .map(
      (st) => st.trim().substring(0, 1).toUpperCase()
        + st.trim().substring(1, st.length).toLowerCase(),
    )
    .join(' ');
}

export function isCurrentTimeInRange(startTime: string, endTime: string): boolean {
  const now = new Date();
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  return isAfter(now, start) && isBefore(now, end);
}

export function debounce<T extends(
...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const clearEmptyObject = (obj: {[key:string]: any}) => {
  const newObj:{[key:string]: any} = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      newObj[key] = value;
    }
  }
  return newObj;
};

export function clearCookie(key?: string) {
  document.cookie = `${key || 'eecommerce'}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function copyToClipboard(text:string) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  toast({ title: 'ID COPY!', description: 'Id Copy successful' });
}
