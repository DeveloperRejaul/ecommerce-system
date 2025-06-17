import { useState } from 'react';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDeleteOrderMutation, useGetOrderQuery } from './api';
import TableIndex from '@/components/TableIndex';
import { path } from '@/core/router/router';

export default function Order() {
  const limit = 10;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetOrderQuery({ page, limit });
  const [deleteOrder] = useDeleteOrderMutation();
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

  const handleDelete = (d:any) => {
    deleteOrder({ id: d.id, page, limit });
  };

  const handleEdit = (d:any) => {
    navigate(path.UPDATE_ORDER, { state: { ...d, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'OrderId', className: 'w-[100px]' },
        { text: 'User' },
        { text: 'Name' },
        { text: 'Status' },
        { text: 'Time' },
        { text: 'Price' },
        { text: 'Items' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ orderId, price, status, user, createdAt, products, ...props }, index) => ({ ...props, '#SL': ((index + 1) + (page * limit)), orderId: `#${orderId}`, avatar: user?.avatar, name: user?.name, status, time: formatDistance(createdAt, new Date(), { addSuffix: true }), price, items: `${products?.length}`, action: 'action', products, email: user?.email }))}
      caption="A list of your all Category"
      activePage={(page + 1)}
      totalPage={data?.total_page}
      handleNextPage={handleNext}
      handlePrevuesPage={handlePrevuesPage}
      handlePageNumber={handlePageNumber}
      cellStyle={{
        key: 'status',
        value: ['Completed', 'Canceled', 'On Delivery'],
        className: ['text-blue-500', 'text-red-500', 'text-yellow-500'],
      }}
      handleDelete={handleDelete}
      handleDetails={handleEdit}
    />
  );
}
