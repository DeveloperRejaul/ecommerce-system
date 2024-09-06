import { UserRole } from '@/constant/constant';
import { useAppSelector } from '@/hooks/rtk';
import { NavLink } from 'react-router-dom';

export default function SideBar() {
  const userRole = useAppSelector(state => state.user.role);

  const activeClass = 'flex py-2 pl-2  mx-5 text-xl font-medium bg-muted hover:bg-muted';
  const inActiveClass = 'flex py-2 pl-2 mx-5  text-xl font-medium hover:bg-muted';

  return (
    <div className="w-[300px] h-[100vh] border-r">
      <div className="h-[100px] flex justify-center items-center "> LOGO </div>
      <div className='space-y-4'>
        <NavLink className={({ isActive }) => isActive ? activeClass : inActiveClass} to={'/'} end >
          Home
        </NavLink>
        {userRole === UserRole.SUPPER_ADMIN && <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/shop'
          end >
          Shop
        </NavLink>}
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/category'
          end >
          Category
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/order'
          end >
          Order
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/product'
          end >
          Product
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/coupon'
          end >
          Coupon
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? activeClass : inActiveClass}
          to='/user'
          end >
          User
        </NavLink>
      </div>
    </div>
  );
}
