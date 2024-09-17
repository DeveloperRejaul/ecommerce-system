import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllBrandQuery } from "./api";
import { BrandTypes } from "./types";
import { BASE_URL, UserRole } from "@/core/constant/constant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SquarePen, TrashIcon } from "lucide-react";
import { useAppSelector } from "@/core/hooks/rtk";

export default function Brand() {
    const role = useAppSelector(state => state.user.role);
    const brand = useGetAllBrandQuery(undefined);
    return <Table>
        <TableCaption>A list of your all Brand.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">#SL</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Logo</TableHead>
                {role === UserRole.OWNER && <TableHead>Shop Name</TableHead>}
                {role === UserRole.OWNER && <TableHead>Shop Logo</TableHead>}
                <TableHead className='text-right'>Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {brand.data?.map((d: BrandTypes, i: number) => <TableRow key={Math.random() * i}>
                <TableCell className="font-medium">{(i + 1).toString().padStart(3, '0')}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>
                    <Avatar>
                        <AvatarImage src={`${BASE_URL}/${d.avatar}`} />
                        <AvatarFallback>{d.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </TableCell>
                {role === UserRole.OWNER && <TableCell>{d.shopId.name}</TableCell>}
                {role === UserRole.OWNER && <TableCell>
                    <Avatar>
                        <AvatarImage src={`${BASE_URL}/${d.shopId.avatar}`} />
                        <AvatarFallback>{d.shopId.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </TableCell>}
                <TableCell className='flex space-x-2 justify-end'>
                    <TrashIcon className='text-gray-400  cursor-pointer transition-all hover:text-red-500' height={28} width={28} />
                    <SquarePen className='text-gray-400  cursor-pointer transition-all hover:text-blue-400' height={25} width={25} />
                </TableCell>
            </TableRow>
            )}
        </TableBody>
    </Table>;
}
