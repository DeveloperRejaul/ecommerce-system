/* eslint-disable react-compiler/react-compiler */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from '@/components/loading';
import { useCheckValidUserQuery } from '@/feature/auth/api';
import { useAppSelector } from '@/core/hooks/rtk';
import { path } from './router';

interface ProtectedProps {
  children: ReactNode
}

export default function Protected({ children }: ProtectedProps) {
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const { isError, isLoading, isFetching } = useCheckValidUserQuery(undefined);

  if (isFetching || isLoading) return <Loading />;
  if (!isLogin || isError) return <Navigate to={path.LOGIN} />;
  if (isLogin) return children;
}
