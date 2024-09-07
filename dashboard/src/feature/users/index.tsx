import { useAppSelector } from '@/hooks/rtk';
import { UserRole } from '@/constant/constant';
import Owner from './owner';
import SuperAdmin from './super-admin';
import Admin from './admin';
import Moderator from './moderator';

export default function User() {
    const role = useAppSelector(state => state.user.role);

    switch (role) {
        case UserRole.OWNER:
            return <Owner />;
        case UserRole.SUPER_ADMIN:
            return <SuperAdmin />;
        case UserRole.ADMIN:
            return <Admin />;
        case UserRole.MODERATOR:
            return <Moderator />;
        default:
            break;
    }
}
