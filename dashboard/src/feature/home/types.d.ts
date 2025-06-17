interface IUser {
  name: string;
  id: string;
  email: string;
  avatar: string;
}

interface Sell {
  price: number;
  id: string;
  user: IUser;
}

export interface ISellData {
    count: number;
    sells: Sell[];
}
