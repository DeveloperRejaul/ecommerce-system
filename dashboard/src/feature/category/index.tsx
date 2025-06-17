/* eslint-disable max-len */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllCategoryQuery, useRemoveCategoryMutation } from './api';
import TableIndex from '@/components/TableIndex';
import { path } from '@/core/router/router';

export default function Category() {
  const limit = 10;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetAllCategoryQuery({ page, limit });
  const [removeCategory] = useRemoveCategoryMutation();
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

  const handleDelete = (d: { id: any; }) => {
    removeCategory({ id: d.id, page, limit });
  };
  const handleEdit = (d: any) => {
    navigate(path.CREATE_CATEGORY, { state: { ...d, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'Name' },
        { text: 'Type' },
        { text: 'Discount' },
        { text: 'Avatar', className: '' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ name, avatar, discount, type, ...props }, index) => ({ ...props, '#SL': ((index + 1) + (page * limit)), name, type, discount, avatar, action: 'action' }))}
      caption="A list of your all Category"
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
