import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  email: string;
  name: string;
  address: string;
  avatar: string;
  role: string;
  shopId: string;
}

const initialState = {
  id: "",
  email: "",
  name: "",
  address: "",
  avatar: "",
  role: "",
  shopId: ""
} satisfies userState as userState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<userState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.address = action.payload.address;
      state.avatar = action.payload.avatar;
      state.role = action.payload.role;
      state.shopId = action.payload.shopId;
    },
    updateUser(state, action: PayloadAction<userState>) {
      state = { ...state, ...action.payload };
    },
  },
});

export const { addUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
