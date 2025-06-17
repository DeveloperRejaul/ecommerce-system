import React from 'react';
import { useGetShopQuery } from '../rtk/shop-api';
import SplashScreen from './SplashScreen';
import Expire from './Expire';

export default function Main({ children }: Readonly<{children: React.ReactNode}>) {
  const { data, isLoading, isFetching } = useGetShopQuery(undefined);
  const expirationDate = new Date(data?.expireDate || new Date());
  const currentDate = new Date();

  const isValid = currentDate < expirationDate;

  if (isFetching || isLoading) return <SplashScreen />;
  if (isValid) return children;
  if (!isValid) return <Expire />;
}
