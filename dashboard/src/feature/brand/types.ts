import { IShopTypes } from "../shop/types";

export interface BrandTypes {
    "_id": string;
    "name": string;
    "avatar": string;
    "shopId": IShopTypes;
    "createdAt": string;
    "updatedAt": string;
    "__v": string;
}