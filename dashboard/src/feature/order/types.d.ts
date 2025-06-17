interface Address {
    id: number;
    name: string;
    address: string;
    town: string;
    district: string;
    state: string;
    code: string;
    phone: string;
    type: string;
    isDefault: boolean;
  }

  interface Product {
    productId: string;
    quantity: number;
  }

  interface IUser {
    name:string;
    avatar:string
    email:string
  }

export interface IOrderRes {
    id: string;
    orderId: string;
    products: Product[];
    address: Address[] | string; // Address[] if parsed, string if raw JSON string
    userId: string;
    shopId: string;
    couponId: string | null;
    status: 'Completed'| 'Canceled' | 'On Delivery';
    user: IUser
    price: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
