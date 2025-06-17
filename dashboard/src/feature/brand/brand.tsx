import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteBrandMutation, useGetAllBrandQuery } from './api';
import TableIndex from '@/components/TableIndex';
import { path } from '@/core/router/router';

export default function Brand() {
  const limit = 10;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetAllBrandQuery({ page, limit });
  const [deleteBrand] = useDeleteBrandMutation();
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

  const handleDelete = (d: { id: string; }) => {
    deleteBrand({ id: d.id, page, limit });
  };
  const handleEdit = (d: any) => {
    navigate(path.CREATE_BRAND, { state: { ...d, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'Name' },
        { text: 'Logo' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ name, avatar, ...props }, index) => ({ ...props, '#SL': ((index + 1) + (page * limit)), name, avatar, action: 'action' }))}
      caption="A list of your all Brand."
      activePage={(page + 1)}
      totalPage={data?.total_page}
      handleNextPage={handleNext}
      handlePrevuesPage={handlePrevuesPage}
      handlePageNumber={handlePageNumber}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      cellStyle={{
        key: 'status',
        value: ['Active', 'Inactive'],
        className: ['text-blue-500', 'text-red-500'],
      }}
    />
  );
}
