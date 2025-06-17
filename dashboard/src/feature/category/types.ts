export interface ICategoryType {
    id: string;
    name: string;
    avatar: string;
    type: 'ROUNDED' | 'SQUARE' | 'TOP_SELECTION' | 'HIDE';
    discount: number;
    shopId: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    subcategories: ICategoryType[];
}
