import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from './core/router/router';
import { store } from './core/rtk/store';
import { Toaster } from '@/components/ui/toaster';
import AlertContainer from './components/Alert';

export default function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <AlertContainer />
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </Provider>
  );
}
