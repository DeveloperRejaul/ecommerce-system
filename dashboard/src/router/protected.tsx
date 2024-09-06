import { Loading } from '@/components/loading';
import { paths } from '@/constant/route';
import { useLazyCheckValidUserQuery } from '@/feature/auth/api';
import { useAppSelector } from '@/hooks/rtk';
import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  children: ReactNode
}


export default function Protected({ children }: ProtectedProps) {
  const isLogin = useAppSelector(state => state.auth.isLogin);
  const [checkValidUser, response] = useLazyCheckValidUserQuery();

  if (isLogin) return children;

  useEffect(() => {
    checkValidUser(undefined);
  }, []);

  if (!isLogin && response.isLoading) return <Loading />;
  if (!isLogin) return <Navigate to={paths.root[1]} />; // navigate to login screen

}
