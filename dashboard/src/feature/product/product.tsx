import { TableCom } from '@/components/table';
import { useGetAllProductQuery } from './api';

export default function Product() {
    const product = useGetAllProductQuery(undefined);
    console.log(product.data);

    return <TableCom />;
}
