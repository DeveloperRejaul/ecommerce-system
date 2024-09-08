import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BASE_URL } from '@/constant/constant';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { useGetAllCategoryQuery } from './api';
import { ICategoryType } from './types';

export default function category() {
    const res = useGetAllCategoryQuery(undefined);

    return <Table>
        <TableCaption>A list of your all Category.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">#SL</TableHead>
                <TableHead>Name</TableHead>
                <TableHead >Shop</TableHead>
                <TableHead >Avatar</TableHead>
                <TableHead >Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {res.data?.map((d: ICategoryType, i: number) => <TableRow key={Math.random() * i}>
                <TableCell className="font-medium">{(i + 1).toString().padStart(3, '0')}</TableCell>
                <TableCell >{d.name}</TableCell>
                <TableCell >{d.shopId.name}</TableCell>
                <TableCell>
                    <Avatar>
                        <AvatarImage src={`${BASE_URL}/file/${d.avatar}`} alt="@shadcn" />
                        <AvatarFallback>{d.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </TableCell>
                <TableCell className='flex space-x-2'>
                    <TrashIcon className='text-gray-400  cursor-pointer transition-all hover:text-red-500' height={28} width={28} />
                    <Pencil2Icon className='text-gray-400  cursor-pointer transition-all hover:text-blue-400' height={25} width={25} />
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>;
}
