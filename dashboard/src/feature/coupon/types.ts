import { IShopTypes } from "../shop/types";

interface TimePeriod {
    from: string; // ISO 8601 date string
    to: string;   // ISO 8601 date string
    _id: string;
}

export interface ICouponTypes {
    _id: string;
    name: string;
    type: 'FIX' | 'PERCENT';
    value: number;
    time: TimePeriod;
    quantity: number;
    userId: string[];
    shopId: IShopTypes;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    __v: number;
}
