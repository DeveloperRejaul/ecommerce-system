import { RouterProvider } from 'react-router-dom';
import { router } from './core/router/router';
import { Provider } from 'react-redux';
import { store } from './core/rtk/store';
import { Toaster } from '@/components/ui/toaster';


function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
