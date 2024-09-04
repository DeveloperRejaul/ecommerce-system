import { Loading } from '@/components/loading';
import { paths } from '@/constant/route';
import { ReactNode, useState } from 'react';
import { Navigate} from 'react-router-dom';

interface ProtectedProps { 
  children: ReactNode
}

const isLogin = false;
export default function Protected({ children }: ProtectedProps) {
    const [isLoading, setLoading] = useState(true);

 

    if (isLoading) return <Loading/>;
    if (!isLogin) return <Navigate to={paths.root[1]} />;
    return children;
}
