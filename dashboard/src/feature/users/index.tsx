/* eslint-disable no-shadow */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableIndex from '@/components/TableIndex';
import { useDeleteUserMutation, useGetAllUsersQuery } from './api';
import { useAppSelector } from '@/core/hooks/rtk';
import { userRoleValue } from '@/core/constant/constant';
import { UserRoleType } from './userSlice';
import { toast } from '@/core/hooks/use-toast';
import { path } from '@/core/router/router';

export default function Index() {
  const limit = 10;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetAllUsersQuery({ page, limit });
  const role = useAppSelector((state) => state.user.role);
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const handleNext = () => {
    setPage((pre) => pre + 1);
    if ((data?.total_page || 0) > page) {
      refetch();
    }
  };

  const handlePrevuesPage = () => {
    if (page >= 1) setPage((pre) => pre - 1);
    if (page >= 1) {
      refetch();
    }
  };

  const handlePageNumber = (num: number) => {
    if (num === page + 1) return;
    setPage(num - 1);
    refetch();
  };

  const handleDelete = (data: { role: any; id: any; }) => {
    if (userRoleValue[(role || 'USER')] > userRoleValue[((data.role || 'USER') as UserRoleType) || 'USER']) return deleteUser({ id: data.id, page, limit });
    toast({
      title: 'Delete user Failed!',
      description: 'You have not access to delete this user',
    });
  };
  const handleEdit = (data: any) => {
    navigate(path.CREATE_USER, { state: { ...data, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'Name' },
        { text: 'Email' },
        { text: 'Role' },
        { text: 'Avatar' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ name, email, role, avatar, ...props }, index) => ({ ...props, '#SL': ((index + 1) + (page * limit)), name, email, role, avatar, action: 'action' }))}
      caption="A list of your all coupons"
      activePage={(page + 1)}
      totalPage={data?.total_page}
      handleNextPage={handleNext}
      handlePrevuesPage={handlePrevuesPage}
      handlePageNumber={handlePageNumber}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />
  );
}
