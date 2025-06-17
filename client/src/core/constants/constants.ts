import { color } from './color';


export const BASE_URL =  `http://192.168.0.199:3001/api/v-1`;
export const SHOP_ID = 'f161e1e2-9128-452c-a55c-dda5fcf7399d';

export enum CategoryType {
  ROUNDED='ROUNDED',
  SQUARE='SQUARE',
  TOP_SELECTION='TOP_SELECTION',
  HIDE='HIDE'
}

export enum UserRole {
  OWNER = 'OWNER', SUPER_ADMIN='SUPER_ADMIN', ADMIN='ADMIN', MODERATOR='MODERATOR', USER='USER', SELLER = 'SELLER',
 }

export enum DB {
  NAME='MY-APP.db',
  AUTH_TABLE='authTable',
  HISTORY_TABLE='historyTable',
  ADDRESS_TABLE='addressTable',
  CARD='card',
}

export const colors:{[key:string]:string} = {
  Completed: color.success,
  Canceled: color.active,
  'On Delivery': color.primary,
};

export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
