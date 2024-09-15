import { BrandTypes } from "../brand/types";
import { ICategoryType } from "../category/types";
import { ICouponTypes } from "../coupon/types";
import { IUsersData } from "../users/types";

export interface SizeTypes {
    s: number,
    m: number,
    l: number,
    xl: number,
    "2xl": number
    "3xl": number
    "4xl": number
}

export interface ProductType {
    _id: string;
    name: string;
    title: string;
    images: string;
    buyPrice: string;
    sellPrice: string;
    size: SizeTypes,
    color: string[];
    description: string;
    quantity: string;
    categoryId: ICategoryType;
    couponId: ICouponTypes[]
    userId: IUsersData[];
    shopId: string;
    brandId: BrandTypes;
    createdAt: string;
    updatedAt: string;
    __v: string;
}