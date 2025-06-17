/* eslint-disable react/require-default-props */
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { path } from './router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { capitalizeEachWord } from '../lib/utils';
import { useAppSelector } from '../hooks/rtk';
import SideBarMenuIcon from '@/assets/icon/siderBarMenu-icon';
import Plus from '@/assets/icon/Plus';

interface IHeaderProps {
  menuPress?: () => void
}

export default function Header(props : IHeaderProps) {
  const { menuPress } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { role, avatar, name } = useAppSelector((state) => state.user);

  const btnTitle: {[key:string]:string} = {
    [path.CATEGORY]: 'Create Category',
    [path.PRODUCT]: 'Create Product',
    [path.BRAND]: 'Create Brand',
    [path.USER]: 'Create User',
    [path.COUPON]: 'Create Coupon',
  };
  if (role === 'OWNER') {
    btnTitle[path.SHOP] = 'Create Shop';
  }

  const handleClick = (title:string) => {
    switch (title) {
      case 'Create Category':
        navigate(path.CREATE_CATEGORY);
        break;
      case 'Create Product':
        navigate(path.CREATE_PRODUCT);
        break;
      case 'Create Brand':
        navigate(path.CREATE_BRAND);
        break;
      case 'Create User':
        navigate(path.CREATE_USER);
        break;
      case 'Create Coupon':
        navigate(path.CREATE_COUPON);
        break;
      case 'Create Shop':
        navigate(path.CREATE_SHOP);
        break;
      default:
        break;
    }
  };
  return (
    <div className="h-[7vh] flex items-center justify-between pr-10 md:pr-5 pl-2">
      <div className="flex flex-1 gap-x-10 items-center">
        <div className="hover:cursor-pointer p-2  hidden md:block" onClick={menuPress}>
          <SideBarMenuIcon />
        </div>
        <div className="mx-4 md:w-[30%]">
          <Input type="search" id="search" placeholder="Search..." />
        </div>
      </div>
      <div className="flex gap-x-10 items-center">
        {/* Button Part  */}
        {btnTitle[pathname] && (
        <div className="cursor-pointer border border-zinc-700 px-4 py-2 transition duration-500 hover:bg-zinc-700 hidden md:block" onClick={() => handleClick(btnTitle[pathname])}>
          {btnTitle[pathname]}
        </div>
        )}
        {/* Avatar Part  */}
        <div className="flex flex-row items-center gap-x-2 md:gap-x-5 cursor-pointer">
          { btnTitle[pathname] && <Plus className="block md:hidden" onClick={() => handleClick(btnTitle[pathname])} />}
          <Avatar>
            <AvatarImage src={avatar} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xl">{capitalizeEachWord(name)}</p>
            <p className="text-sm">{capitalizeEachWord(role as string)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
