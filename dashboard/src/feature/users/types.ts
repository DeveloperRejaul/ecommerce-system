import { IShopTypes } from "../shop/types";

export interface IUsersData {
    address: string;
    avatar: string
    createdAt: string
    email: string
    name: string
    role: string
    updatedAt: string
    _id: string
    shopId: IShopTypes
}