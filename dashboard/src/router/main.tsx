import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from           './SideBar';

export default function Main() {
  return (
      <div className='flex flex-row'>
        <SideBar />
      <div className='w-[100%]'>
        <Header />
        <Outlet/>
      </div>  
     </div>
  );
}
