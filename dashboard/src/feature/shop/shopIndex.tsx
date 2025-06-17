import { UserRole } from '@/core/constant/constant';
import { useAppSelector } from '@/core/hooks/rtk';
import Owner from './screen/owner';
import SuperAdmin from './screen/super-admin';

export default function ShopIndex() {
  const role = useAppSelector((state) => state.user.role);

  switch (role) {
    case UserRole.OWNER:
      return <Owner />;
    case UserRole.SUPER_ADMIN:
      return <SuperAdmin />;
    case UserRole.ADMIN:
      return <SuperAdmin />;
    case UserRole.MODERATOR:
      return <SuperAdmin />;
    default:
      break;
  }
}
