'use client';

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import PleaseLogin from '../PleaseLogin';
import PleaseLoginSkeleton from '../skeleton/PleaseLoginSkeleton';
import { getAuthUser, IAuthData } from '@/src/core/db-operations/auth';

// Define the HOC with a generic type that extends React's intrinsic attributes
export function withAuth<T extends React.JSX.IntrinsicAttributes>(Component: React.ComponentType<T & IAuthData>) {
  return function AuthCheck(props: T) {
    const [isLoading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [userdata, setUserData] = useState<IAuthData>({} as IAuthData);
    const isFocused = useIsFocused();

    useEffect(() => {
      getUser();
    }, [isFocused]);

    const getUser = async () => {
      const user = await getAuthUser();
      if (user) {
        setLoading(false);
        setUserData(user);
        setIsLogin(true);
      } else {
        setLoading(false);
        setIsLogin(false);
      }
    };

    if (isLoading) return <PleaseLoginSkeleton />;

    if (!isLogin) return <PleaseLogin />;

    // Render the wrapped component with all props
    return <Component {...{ ...props, ...userdata }} />;
  };
}
