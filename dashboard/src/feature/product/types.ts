export interface SizeTypes {
    s: number,
    m: number,
    l: number,
    xl: number,
    '2xl': number
    '3xl': number
    '4xl': number
}

export interface IProductType {
    id: string;
    name: string;
    title: string;
    description: string;
    images: string[];
    buyPrice: number;
    sellPrice: number;
    discount: number;
    quantity: number;
    categoryId: string;
    category: {
        name:string
    };
    shopId: string;
    brandId: string;
    brand:{
        name:string;
    }
    specification: string;
    keys: string; // Comma-separated keywords
    rating: number;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  }
