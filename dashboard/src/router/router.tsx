/* eslint-disable @typescript-eslint/ban-ts-comment */

import { createBrowserRouter } from 'react-router-dom';
import { homeCom, paths, rootCom } from '@/constant/route';



const child = {
  '/': paths.home.map((pt, i) => ({
    path: pt,
    element: homeCom[i]
  }))
};

const routes = paths.root.map((pt, i) => ({
  path: pt,
  element: rootCom[i],
  //@ts-ignore
  children: child[pt]
}));

export const router = createBrowserRouter(routes);
