import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TableIndex from '@/components/TableIndex';
import { useDeleteCouponMutation, useGetCouponQuery } from './api';
import { isCurrentTimeInRange } from '@/core/lib/utils';
import { path } from '@/core/router/router';

export default function Coupon() {
  const limit = 12;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetCouponQuery({ limit, page });
  const navigate = useNavigate();
  const [deleteCoupon] = useDeleteCouponMutation();

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
    deleteCoupon({ id: d.id, page, limit });
  };
  const handleEdit = (d: any) => {
    navigate(path.CREATE_COUPON, { state: { ...d, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'Name' },
        { text: 'Type' },
        { text: 'Quantity' },
        { text: 'Start Date' },
        { text: 'End Date' },
        { text: 'Status' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ name, type, quantity, time, ...props }, index) => ({ ...props, '#SL': ((index + 1) + (page * limit)), name, type, quantity, 'Start Date': format(new Date(time.from), 'PPpp'), 'End Date': format(new Date(time.to), 'PPpp'), status: isCurrentTimeInRange(time.from, time.to) ? 'Active' : 'Inactive', action: 'action', time }))}
      caption="A list of your all coupons"
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
