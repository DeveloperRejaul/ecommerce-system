import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IShopTypes } from '../shop/types';

export type UserRoleType = 'OWNER' | 'SUPER_ADMIN'|'ADMIN' |'MODERATOR' | 'USER'| 'SELLER'| null

export interface IUserState {
  id: string;
  email: string;
  name: string;
  address: string;
  avatar: string;
  role: UserRoleType;
  shopId: string;
  shop: IShopTypes
}

const initialState = {
  id: '',
  email: '',
  name: '',
  address: '',
  avatar: '',
  role: null,
  shopId: '',
  shop: {} as IShopTypes,
} satisfies IUserState as IUserState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<IUserState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.address = action.payload.address;
      state.avatar = action.payload.avatar;
      state.role = action.payload.role;
      state.shopId = action.payload.shopId;
      state.shop = action.payload.shop;
    },
    updateUser(state, action: PayloadAction<IUserState>) {
      state = { ...state, ...action.payload };
    },
  },
});

export const { addUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
