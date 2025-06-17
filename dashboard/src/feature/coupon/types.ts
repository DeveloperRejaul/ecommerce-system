export interface ICouponTypes {
    id: string;
    name: string;
    type: "PERCENT" | "FIXED"; // Add other types if applicable
    value: number;
    quantity: number;
    shopId: string;
    usersId: string[];
    categorysId: string[];
    productsId: string | null;
    time: {
      from: string; // ISO string
      to: string;   // ISO string
    };
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}
