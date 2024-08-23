import { Request } from "express";

export interface IFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

export interface AuthRequest extends Request {
  email: string;
  id: string;
  role: string;
}

export interface AuthBody {
  email: string;
  id: string;
  role: string;
}
