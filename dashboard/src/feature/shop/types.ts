export interface IShopTypes {
    id: string;
    name: string;
    email: string;
    address: string;
    avatar: string;
    banner: string[]; // Array of image filenames or URLs
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    userId: string;
    price:number;
    expireDate: string
}
