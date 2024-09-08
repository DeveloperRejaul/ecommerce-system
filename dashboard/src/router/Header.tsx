import { DialogCom } from '@/components/dialog';
import { SheetCom } from '@/components/sheet';
import { Input } from '@/components/ui/input';
import DialogContent from '@/feature/category/create-category';
import CreateCoupon from '@/feature/coupon/create-coupon';
import CreateShop from '@/feature/shop/create-shop';
import CreateUser from '@/feature/users/create-user';
import { useLocation } from 'react-router-dom';


export default function Header() {
  const { pathname } = useLocation();
  const components: { [key: string]: JSX.Element } = {
    '/user': <CreateUser />,
    '/shop': <CreateShop />,
    '/coupon': <CreateCoupon />
  };

  return (
    <div className="h-[7vh] flex items-center justify-between px-5">
      <div className='w-[30%]'>
        <Input type="search" id="search" placeholder="Search..." />
      </div>
      <div className='flex gap-x-10 items-center'>
        {pathname !== '/' &&
          <DialogCom btnText={pathname}>
            {components[pathname] || <DialogContent />}
          </DialogCom>
        }
        {/* Avatar Part  */}
        <SheetCom />
      </div>
    </div>
  );
}
