import { useGetAllUsersQuery } from './api';
import { Table, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Admin() {
    const res = useGetAllUsersQuery(undefined);

    console.log(res.data);

    return <Table>
        <TableCaption>A list of your all users.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">#SL</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Role</TableHead>
                <TableHead className="text-right">Avatar</TableHead>
                <TableHead className="text-right">Shop Name</TableHead>
            </TableRow>
        </TableHeader>
    </Table>;
}
