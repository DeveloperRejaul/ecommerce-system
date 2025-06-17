import { Outlet } from 'react-router-dom';
import React, { useRef } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Main() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = Array.from({ length: 11 }, () => React.createRef<HTMLDivElement | null>());
  const handleMenuPress = () => {
    sidebarRef.current?.classList.toggle('sidebar-collapsed');
    logoRef.current?.classList.toggle('collapsed-sidebar-avatar');
    labelRefs.forEach((item) => item.current?.classList.toggle('collapsed-sidebar-label'));
  };

  return (
    <div className="flex flex-row overflow-hidden bg-background">
      <SideBar sidebarRef={sidebarRef} labelRefs={labelRefs} logoRef={logoRef} />
      <div className="w-[100%]">
        <Header menuPress={handleMenuPress} />
        <ScrollArea className="h-[93vh] rounded-md border-t p-4">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}
