import { TableCom } from '@/components/table';
import { useGetOrderQuery } from './api';

export default function Order() {
    const order = useGetOrderQuery({});

    console.log(order);

    return <TableCom />;
}
