import { createBrowserRouter } from 'react-router-dom';
import Login from '../feature/auth/login';
import Main from './main';
import Home from '@/feature/home/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element:<Home/>
      }
    ]
  },
  {
    path: '/auth',
    element:<Login/>
  }
]);
