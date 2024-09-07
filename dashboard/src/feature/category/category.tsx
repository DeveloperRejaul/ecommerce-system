import { TableCom } from '@/components/table';
import { useGetAllCategoryQuery } from './api';

export default function Category() {
    const response = useGetAllCategoryQuery(undefined);

    return <TableCom />;
}
