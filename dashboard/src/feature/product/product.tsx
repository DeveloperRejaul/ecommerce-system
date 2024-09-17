import { useGetAllProductQuery } from './api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductType } from './types';
import { ArrowBigRightDash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { path } from '@/core/router/router';

export default function Product() {
    const product = useGetAllProductQuery(undefined);
    const navigate = useNavigate();


    return <Table>
        <TableCaption>A list of your all Product.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Product Name & Size</TableHead>


                <TableHead className='text-right'>Details</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {product.data?.map((d: ProductType, i: number) => <TableRow key={Math.random() * i}>
                <TableCell >  he</TableCell>
            </TableRow>
            )}
        </TableBody>
    </Table>;
}
