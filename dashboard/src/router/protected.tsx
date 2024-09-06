import { Loading } from '@/components/loading';
import { paths } from '@/constant/route';
import { useLoginMutation } from '@/feature/auth/api';
import { useAppSelector } from '@/hooks/rtk';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  children: ReactNode
}


export default function Protected({ children }: ProtectedProps) {
  const isLogin = useAppSelector(state => state.auth.isLogin);
  const [handleLogin, response] = useLoginMutation()

  if (isLogin) return children;

  if (!isLogin && response.isLoading) return <Loading />;
  if (!isLogin) return <Navigate to={paths.root[1]} />;

}
