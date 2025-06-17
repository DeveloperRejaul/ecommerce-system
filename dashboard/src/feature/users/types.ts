export interface IUsersData {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string; // Consider using a more secure type for passwords in production
    address: string;
    avatar: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'OWNER' | 'SELLER' // Add other roles as needed
    shopId: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}
