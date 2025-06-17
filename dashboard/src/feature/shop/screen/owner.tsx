import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseISO, differenceInDays } from 'date-fns'; // Import necessary functions from date-fns
import { useDeleteShopMutation, useGetShopQuery } from '../api';
import TableIndex from '@/components/TableIndex';
import { path } from '@/core/router/router';

export default function Owner() {
  const limit = 10;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetShopQuery({ page, limit });
  const [deleteShop] = useDeleteShopMutation();
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
    deleteShop({ id: d.id, page, limit });
  };
  const handleEdit = (d: any) => {
    navigate(path.CREATE_SHOP, { state: { ...d, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'Name' },
        { text: 'Email' },
        { text: 'Logo' },
        { text: 'User' },
        { text: 'Avatar' },
        { text: 'Expire time' },
        { text: 'Price' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ name, email, avatar, user, expireDate, price, ...props }:any, index:number) => ({ ...{ ...props, expireDate }, '#SL': ((index + 1) + (page * limit)), name, email, avatar, user: user?.name || '--', 'avatar-1': user?.avatar || '--', 'Expire time': `${expireDate ? differenceInDays(parseISO(expireDate), new Date()) : 'N/A'} days left`, price, action: 'action' }))}
      caption="A list of your all coupons"
      activePage={(page + 1)}
      totalPage={data?.total_page}
      handleNextPage={handleNext}
      handlePrevuesPage={handlePrevuesPage}
      handlePageNumber={handlePageNumber}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      clipboardEnable
    />
  );
}
