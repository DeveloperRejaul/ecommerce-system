import { useGetShopQuery } from './api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IShopTypes } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BASE_URL } from '@/constant/constant';
import { SquarePen, TrashIcon } from 'lucide-react';
// import { ScrollArea } from '@/components/ui/scroll-area';

export default function Shop() {
    const res = useGetShopQuery(undefined);
    return <Table>
        <TableCaption>A list of your all shop.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">#SL</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead >Avatar</TableHead>
                <TableHead className='text-right'>Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {res.data?.map((d: IShopTypes, i: number) => <TableRow key={Math.random() * i}>
                <TableCell className="font-medium">{(i + 1).toString().padStart(3, '0')}</TableCell>
                <TableCell >{d.name}</TableCell>
                <TableCell >{d.email}</TableCell>
                <TableCell >{d.address}</TableCell>
                <TableCell>
                    <Avatar>
                        <AvatarImage src={`${BASE_URL}/file/${d.avatar}`} alt="@shadcn" />
                        <AvatarFallback>{d.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </TableCell>
                <TableCell className='flex space-x-2 justify-end'>
                    <TrashIcon className='text-gray-400  cursor-pointer transition-all hover:text-red-500' height={28} width={28} />
                    <SquarePen className='text-gray-400  cursor-pointer transition-all hover:text-blue-400' height={25} width={25} />
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>;

}
