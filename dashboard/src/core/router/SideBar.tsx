import { UserRole } from '@/core/constant/constant';
import { useAppSelector } from '@/core/hooks/rtk';
import { NavLink } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { path } from './router';



export default function SideBar() {
  const userRole = useAppSelector(state => state.user.role);

  const activeClass = 'flex py-2 pl-2  mx-5 text-xl font-medium bg-muted hover:bg-muted';
  const inActiveClass = 'flex py-2 pl-2 mx-5  text-xl font-medium hover:bg-muted';

  return (
    <div className="w-[300px] h-[100vh] border-r">
      <div className="h-[100px] flex justify-center items-center "> LOGO </div>
      <div className='space-y-4'>
        <NavLink className={({ isActive }) => isActive ? activeClass : inActiveClass} to={'/'} end={false} >
          Home
        </NavLink>
        {userRole === UserRole.OWNER && <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/shop'
          end={false} >
          Shop
        </NavLink>}
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/category'
          end={false} >
          Category
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/order'
          end={false} >
          Order
        </NavLink>
        <Accordion type="single" collapsible className='text-xl font-medium mx-5'>
          <AccordionItem value='items-91'>
            <AccordionTrigger className='p-2 [&[data-state=open]]:bg-muted'>Product</AccordionTrigger>
            <AccordionContent className='space-y-2 mt-4 border-l'>
              <NavLink
                className={({ isActive }) => isActive ? activeClass : inActiveClass}
                to={path.CREATE_PRODUCT}
                end={false} >
                Create Product
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? activeClass : inActiveClass}
                to={path.PRODUCT}
                end={false} >
                Product List
              </NavLink>
              <NavLink
                style={{ pointerEvents: "none" }}
                className={({ isActive }) => isActive ? activeClass : inActiveClass}
                to={path.PRODUCT_EDIT}
                end={false} >
                Update Product
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? activeClass : inActiveClass}
                to={path.RATTING}
                end={false} >
                Ratting
              </NavLink>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to={path.COUPON}
          end={false} >
          Coupon
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to={path.USER}
          end={false} >
          User
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to={path.BRAND}
          end={false} >
          Brand
        </NavLink>
      </div>
    </div>
  );
}
