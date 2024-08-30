import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from           './SideBar';

export default function Main() {
  return (
      <div className='flex flex-row overflow-hidden'>
      <SideBar />
      <div className='w-[100%]'>
        <Header />
        <div className='h-[93vh] overflow-y-scroll'>
         <Outlet/>
        </div>
      </div>  
     </div>
  );
}
