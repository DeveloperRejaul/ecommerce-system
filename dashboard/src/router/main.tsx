import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from './SideBar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Main() {
  return (
    <div className='flex flex-row overflow-hidden bg-background'>
      <SideBar />
      <div className='w-[100%]'>
        <Header />
        <ScrollArea className="h-[93vh] rounded-md border-t p-4">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}
