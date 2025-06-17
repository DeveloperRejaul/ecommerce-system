/* eslint-disable max-len */
import { NavLink } from 'react-router-dom';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/core/hooks/rtk';
import { path } from './router';
import { useLogoutUserMutation } from '@/feature/auth/api';
import { logout } from '@/feature/auth/slice';
import { useGetShopByIdQuery } from '@/feature/shop/api';
import { UserRole } from '../constant/constant';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogoImg from '@/assets/logo-tr.png';
import CategoryIcon from '@/assets/icon/category-icon';
import ProductIcon from '@/assets/icon/product-icon';
import { alertDialog } from '@/components/Alert';
import { clearCookie } from '@/core/lib/utils';
import Image from '@/components/image';
import UserRound from '@/assets/icon/UserRound';
import UsersRound from '@/assets/icon/UsersRound';
import Store from '@/assets/icon/Store';
import House from '@/assets/icon/House';
import ShoppingBag from '@/assets/icon/ShoppingBag';
import Puzzle from '@/assets/icon/Puzzle';
import Star from '@/assets/icon/Star';
import Building2 from '@/assets/icon/Building2';
import LogOut from '@/assets/icon/LogOut';

interface ISideBarProps {
  sidebarRef: React.RefObject<HTMLDivElement | null>
  logoRef: React.RefObject<HTMLDivElement | null>
  labelRefs: React.RefObject<HTMLDivElement | null>[]
}

export default function SideBar(props:ISideBarProps) {
  const { sidebarRef, labelRefs, logoRef } = props;
  const [logoutUser] = useLogoutUserMutation();
  const { shopId, role } = useAppSelector((state) => state.user);
  const { data } = useGetShopByIdQuery({ id: shopId });
  const dispatch = useAppDispatch();
  const { ADMIN, MODERATOR, OWNER, SELLER, SUPER_ADMIN } = UserRole;
  const handleLogout = () => {
    alertDialog.show({ message: 'Logout ' }, (value) => {
      if (value === 'continue') {
        clearCookie();
        logoutUser({});
        dispatch(logout());
      }
    });
  };

  const activeClass = 'flex py-2 pl-2  mx-5 text-lg font-medium bg-muted gap-x-2 hover:bg-muted';
  const inActiveClass = 'flex py-2 pl-2 mx-5  text-lg font-medium gap-x-2 hover:bg-muted';

  const links = [
    { path: path.ROOT, label: 'Home', icon: House, role: [ADMIN, MODERATOR, OWNER, SELLER, SUPER_ADMIN] },
    { path: path.CATEGORY, label: 'Category', icon: CategoryIcon, role: [ADMIN, MODERATOR, SELLER, SUPER_ADMIN] },
    { path: path.ORDER, label: 'Order', icon: ShoppingBag, role: [ADMIN, MODERATOR, SELLER, SUPER_ADMIN] },
    { path: path.PRODUCT, label: 'Product', icon: ProductIcon, role: [ADMIN, MODERATOR, SELLER, SUPER_ADMIN] },
    { path: path.COUPON, label: 'Coupon', icon: Puzzle, role: [ADMIN, MODERATOR, SELLER, SUPER_ADMIN] },
    { path: path.RATTING, label: 'Ratting', icon: Star, role: [ADMIN, MODERATOR, SELLER, SUPER_ADMIN] },
    { path: path.SHOP, label: 'Shop', icon: Store, role: [ADMIN, MODERATOR, OWNER, SELLER, SUPER_ADMIN] },
    { path: path.USER, label: 'User', icon: UsersRound, role: [ADMIN, MODERATOR, OWNER, SELLER, SUPER_ADMIN] },
    { path: path.BRAND, label: 'Brand', icon: Building2, role: [ADMIN, MODERATOR, SELLER, SUPER_ADMIN] },
    { path: path.ABOUT, label: 'About', icon: UserRound, role: [ADMIN, MODERATOR, OWNER, SELLER, SUPER_ADMIN] },
  ];

  return (
    <div ref={sidebarRef} className="w-[300px] h-[100vh] border-r flex flex-col justify-between sidebar">
      <div>
        <div className="h-[100px] flex justify-center items-center mb-0 md:mb-10">
          {role === UserRole.OWNER ? <Image src={LogoImg} alt="logo" className="h-10" />
            : (
              <Avatar ref={logoRef} className="sidebar-avatar">
                <AvatarImage src={data?.avatar} alt="@shadcn" />
                <AvatarFallback>{data?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
        </div>
        <div className="space-y-1 md:space-y-4">
          {links.filter((li) => li.role.includes(role as UserRole)).map((link, index) => (
            <NavLink
              key={link.label}
              className={({ isActive }) => (isActive ? activeClass : inActiveClass)}
              to={link.path}
              end
            >
              <link.icon />
              <h2 className="sidebar-label" ref={labelRefs[index]}>{link.label}</h2>
            </NavLink>
          ))}
        </div>
      </div>
      <div
        className="mx-5 my-5 text-center bg-zinc-700 py-3 cursor-pointer transition duration-700 hover:bg-zinc-600 flex justify-center items-center gap-x-2 mb-20  md:mb-10"
        onClick={handleLogout}
      >
        <LogOut className="ml-2" />
        <h2 className="sidebar-label" ref={labelRefs[labelRefs.length - 1]}>Logout</h2>
      </div>
    </div>
  );
}
