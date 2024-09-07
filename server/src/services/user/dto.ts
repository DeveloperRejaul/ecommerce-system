import * as Joi from 'joi';
import { UserRole } from './schema';

const { ADMIN, MODERATOR, OWNER, SUPER_ADMIN, USER } = UserRole;
export const createUserSchema = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(15).required(),
  address: Joi.string().required(),
  role: Joi.string()
    .uppercase()
    .valid(ADMIN, MODERATOR, OWNER, SUPER_ADMIN, USER),
  bookmark: Joi.array().items(Joi.string().id().required()),
  shopId: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(4).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(15),
  address: Joi.string(),
  role: Joi.string()
    .uppercase()
    .valid(ADMIN, MODERATOR, OWNER, SUPER_ADMIN, USER),
  bookmark: Joi.array().items(Joi.string().id().required()),
  shopId: Joi.string(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).max(15),
});

// types
type AddressType =
  `street: ${string}, city: ${string},  state: ${string}, zip: ${string}`;

export interface IUserTypes {
  name: string;
  email: string;
  password: string;
  address: AddressType;
  role: string;
  bookmark: string;
  avatar?: string;
  shopId?:string
}

export interface LoginUserType {
  email: string;
  password: string;
  isRemember?: boolean;
}
