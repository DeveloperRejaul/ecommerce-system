import { DialogCom } from '@/components/dialog';
import { DrawerCom } from '@/components/drawer';
import { Input } from '@/components/ui/input';
import DialogContent from '@/feature/category/dialogContent';
import { useLocation } from 'react-router-dom';
export default function Header() {
  const { pathname } = useLocation();


  return (
    <div className="h-[7vh] flex items-center justify-between px-5">
      <div className='w-[30%]'>
        <Input type="search" id="search" placeholder="Search..." />
      </div>
      <div className='flex gap-x-10 items-center'>
        {pathname !== '/' &&
          <DialogCom btnText={pathname}>
            <DialogContent />
          </DialogCom>
        }
        {/* Avatar Part  */}
        <DrawerCom />
      </div>
    </div>
  );
}
