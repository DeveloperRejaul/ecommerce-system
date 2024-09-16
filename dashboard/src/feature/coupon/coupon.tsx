import { useGetCouponQuery } from './api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SquarePen, TrashIcon } from 'lucide-react';
import { ICouponTypes } from './types';
import { useAppSelector } from '@/core/hooks/rtk';
import { BASE_URL, UserRole } from '@/core/constant/constant';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function Coupon() {
    const res = useGetCouponQuery(undefined);
    const role = useAppSelector(state => state.user.role);

    return <Table>
        <TableCaption>A list of your all users.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">#SL</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                {role === UserRole.OWNER && <TableHead>Shop</TableHead>}
                <TableHead className='text-right'>Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {res.data?.map((d: ICouponTypes, i: number) => <TableRow key={Math.random() * i}>
                <TableCell className="font-medium">{`${i + 1}`.padStart(3, '0')}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.type}</TableCell>
                <TableCell>{d.quantity}</TableCell>
                <TableCell>{format(new Date(d.time.from), 'PPpp')}</TableCell>
                <TableCell>{format(new Date(d.time.to), 'PPpp')}</TableCell>
                {role === UserRole.OWNER && <TableCell>
                    <Avatar>
                        <AvatarImage src={`${BASE_URL}/file/${d.shopId.avatar}`} alt="@shadcn" />
                        <AvatarFallback>{d.shopId.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </TableCell>}
                <TableCell className='flex space-x-2 justify-end'>
                    <TrashIcon className='text-gray-400  cursor-pointer transition-all hover:text-red-500' height={28} width={28} />
                    <SquarePen className='text-gray-400  cursor-pointer transition-all hover:text-blue-400' height={25} width={25} />
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>;
}
