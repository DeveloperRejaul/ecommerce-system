import { useAppSelector } from '@/core/hooks/rtk';
import SuperAdmin from './screens/super-admin';
import Owner from './screens/owner';

export default function Home() {
  const userRole = useAppSelector((state) => state.user.role);
  switch (userRole) {
    case 'OWNER':
      return <Owner />;
    case 'SUPER_ADMIN':
      return <SuperAdmin />;
    case 'ADMIN':
      return <SuperAdmin />;
    case 'MODERATOR':
      return <SuperAdmin />;
    default:
      break;
  }
}
