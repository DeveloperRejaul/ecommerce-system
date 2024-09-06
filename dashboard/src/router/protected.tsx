import { paths } from '@/constant/route';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  children: ReactNode
}


export default function Protected({ children }: ProtectedProps) {



  // if (isLoading) return <Loading/>;
  // if (!isLogin) return <Navigate to={paths.root[1]} />;
  return children;
}
