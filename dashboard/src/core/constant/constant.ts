/* eslint-disable no-unused-vars */
// export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const BASE_URL = 'http://localhost:3001/api/v-1';

export enum OrderStatus {
  COMPLETED ='Completed', CANCELED ='Canceled', ON_DELIVERY= 'On Delivery'
}

export enum SoftwareInfo{
  SOFTWARE_NAME = 'Aptinity'
}

export enum UserRole {
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
  SELLER = 'SELLER',
}

export const userRoleValue = {
  [UserRole.OWNER]: 5,
  [UserRole.SUPER_ADMIN]: 4,
  [UserRole.ADMIN]: 3,
  [UserRole.MODERATOR]: 2,
  [UserRole.USER]: 1,
  [UserRole.SELLER]: 0,
};

export const dimension = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
