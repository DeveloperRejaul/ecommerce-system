export const BASE_URL = import.meta.env.VITE_BASE_URL;

export enum UserRole {
  OWNER = "OWNER",
  SUPPER_ADMIN = "SUPPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}
