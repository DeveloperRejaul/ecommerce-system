import React from 'react';
import { TextStyle, ViewProps, ViewStyle } from 'react-native';
import { CategoryType } from './src/core/constants/constants';

export interface IData {
  id?: string;
  imgUrl: string
}

export interface ICardCarousal {
  data: IData[];
  loop?:boolean;
  duration?:number;
  play?: boolean;
  onStart?:(value: boolean)=>void;
  onEnd?:(value: boolean)=> void;
  onChange?:(index: number) => void;
  height?: number;
  width?: number;
  nextBtn?: React.ReactNode;
  prevuesBtn?: React.ReactNode
  dotActiveColor?: string;
  dotInactiveColor?:string;
  containerStyle?:ViewStyle
  dotStyle?: ViewStyle
  dotActiveStyle?:ViewStyle,
  dotInactiveStyle?:ViewStyle,
}

export interface ICardPros {
    id: string;
    img: string;
    name: string;
    title: string;
    price: number;
    discount: number;
    rating: number;
    description:string
    onPress?: ()=>void
}
export interface IRadioProps {
  size?: number;
  inActiveColor?: string;
  activeColor?: string;
  inValidColor?: string;
  label?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  value: string;
  borderStyle?: ViewStyle
  borderActiveStyle?: ViewStyle
  borderInactiveStyle?: ViewStyle
  ballStyle?: ViewStyle
  ballActiveStyle?: ViewStyle
  ballInactiveStyle?: ViewStyle
  containerStyle?: ViewStyle
  containerActiveStyle?: ViewStyle
  containerInactiveStyle?: ViewStyle
  labelStyle?: TextStyle
  labelActiveStyle?: TextStyle
  labelInactiveStyle?: TextStyle
  text?: string;
  gap?: number
  textStyle?: TextStyle
  textActiveStyle?: TextStyle
  textInactiveStyle?: TextStyle
 }
export interface IContextRadioGroup{
  setActiveValue: React.Dispatch<React.SetStateAction<string>>;
  activeValue: string
  onChange?: (value: string) => void;
}

export interface IRadioGroup extends ViewProps{
  onChange?: (value: string) => void;
  children: React.ReactNode;
  defaultActive?: string;
}

export interface IRoundedCategory {
  text:string
  avatar?:string
  isLoading?:boolean
  icon?: React.JSX.Element
  id?: string
}

export interface ICategoryTypes {
  avatar: string;
  createdAt: string; // ISO 8601 date string
  id: string; // UUID
  name: string;
  parentId: string | null; // UUID or null
  shopId: string; // UUID
  type: CategoryType; // Enum for type or generic string
  updatedAt: string; // ISO 8601 date string
  discount: number
}

export interface IShop {
  address: string;
  avatar: string;
  banner: { id: string; imgUrl: string; }[]; // Array of image file names
  createdAt: string; // ISO 8601 date string
  email: string;
  id: string; // UUID
  name: string;
  updatedAt: string; // ISO 8601 date string
  userId: string; // UUID
  expireDate: string; // ISO 8601 date string
  price:string
}

export interface IProduct {
  brandId: string; // UUID for the brand
  buyPrice: number; // Buying price
  categoryId: string; // UUID for the category
  createdAt: string; // ISO 8601 date string
  description: string; // Detailed description with features
  id: string; // UUID for the product
  images: string[]; // Array of image file names
  keys: string; // Comma-separated keywords for search
  name: string; // Product name
  quantity: number; // Available quantity
  rating: number; // Product rating
  sellPrice: number; // Selling price
  shopId: string; // UUID for the shop
  specification: string; // Specifications in formatted text
  title: string; // Title of the product
  updatedAt: string; // ISO 8601 date string
  discount:number
}

export interface APIProduct {
  data: IProduct[]
  total_page:number;
  current_page:number
}

export interface IListMoreParams {
  distanceFromEnd:number
}

export interface IProductRenderItem {
  item:IProduct;
  index:number
}

export interface IProductByCategoryIdParams {
  id?:string,
  limit?:number,
  page?:number,
  discount?:number,
  rating?:number,
  sortField?:'createdAt' | 'sellPrice'|'rating' | 'discount'
  sortOrder?: 'DESC' | 'ASC',
  brands?:string
  discounts?:string,
}

export type SortByBottomSheetItemPressParams = 'What\'s new'|'Price - high to low'|'Price - low to high'|'Popularity'|'Discount'
export interface ISortByBottomSheetProps {
  onPress : (value:SortByBottomSheetItemPressParams) => void
}

export interface IDiscountBottomSheetProps {
  onChange:(value: number[])=>void
}
export interface IBrandBottomSheetProps {
  onChange:(value: string[])=>void
}

export type ShopItemTypes = {
  avatar: string; // URL or path to the avatar image
  createdAt: string; // ISO 8601 timestamp
  id: string; // Unique identifier for the item
  name: string; // Name of the item
  shopId: string; // Unique identifier for the associated shop
  updatedAt: string; // ISO 8601 timestamp
};
export type OnChangeParamsType = {
  label: string;
  isActive: boolean;
}[]
export interface IOrdersBottomSheet {
  onChange: (value: OnChangeParamsType) => void
  select:OnChangeParamsType
}

type ApiUserTypes = {
  address: string;
  avatar: string | null;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'OWNER' | 'MODERATOR'|'SELLER'
  shopId: string;
  token: string;
  updatedAt: string;
  phone:string
};

interface DataItem {
  createdAt: string; // ISO 8601 format date string
  id: string; // UUID
  product: IProduct; // This assumes `product` is an object, replace with correct structure
  productId: string; // UUID
  updatedAt: string; // ISO 8601 format date string
  userId: string; // UUID
}

export interface IWishlistResponse {
  current_page: number;
  data: DataItem[];
  total_page: number;
}

export interface IAddress {
    id?: number | string,
    type:'office' | 'home',
    name:string,
    address:string,
    town:string,
    district:string,
    state:string,
    code:string,
    phone:string,
    isDefault:boolean
}

export interface ICoupon {
  id: string;
  name: string;
  type: 'FIX' | 'PERCENT'; // Use a union type for valid values
  value: number;
  shopId: string;
  time: {
    from: string; // ISO 8601 date-time string
    to: string; // ISO 8601 date-time string
  };
}
export interface IRegisterFormDataTypes {
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  isCheck: boolean,
}

export interface ICardData {
  id:number
  cardId:string
}

export interface ICardProduct extends IProduct {
  pis:number
}

export interface IOrder {
  id:string;
  price: number;
  status : 'Completed' | 'Canceled' | 'On Delivery'
  products: IProduct[]
}
