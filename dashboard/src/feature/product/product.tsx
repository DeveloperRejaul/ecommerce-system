import { useGetAllProductQuery } from './api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductType } from './types';
import { ArrowBigRightDash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { path } from '@/router/router';

export default function Product() {
    const product = useGetAllProductQuery(undefined);
    const navigate = useNavigate();


    return <Table>
        <TableCaption>A list of your all Product.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">#SL</TableHead>
                <TableHead>Name</TableHead>
                <TableHead >Title</TableHead>
                <TableHead >Description</TableHead>
                <TableHead >Quantity</TableHead>
                <TableHead >Buy Price</TableHead>
                <TableHead >Sell Price</TableHead>
                <TableHead >Brand</TableHead>

                <TableHead className='text-right'>Details</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {product.data?.map((d: ProductType, i: number) => <TableRow key={Math.random() * i}>
                <TableCell className="font-medium">{(i + 1).toString().padStart(3, '0')}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.title}</TableCell>
                <TableCell > {d.description.slice(0, 50)}...</TableCell>
                <TableCell > {d.quantity}</TableCell>
                <TableCell > {d.buyPrice}</TableCell>
                <TableCell > {d.sellPrice}</TableCell>
                <TableCell > {d.brandId.name}</TableCell>
                <TableCell className='flex justify-end'>
                    <ArrowBigRightDash className='cursor-pointer' onClick={() => navigate(`${path.PRODUCT}/${d._id}`)} />
                </TableCell>
            </TableRow>
            )}
        </TableBody>
    </Table>;
}
