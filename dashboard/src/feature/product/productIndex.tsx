/* eslint-disable max-len */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableIndex from '@/components/TableIndex';
import { useDeleteProductMutation, useGetAllProductQuery } from './api';
import { path } from '@/core/router/router';

export default function Product() {
  const limit = 10;
  const [page, setPage] = useState(0);
  const { data, refetch } = useGetAllProductQuery({ limit, page });
  const [deleteProduct] = useDeleteProductMutation();
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
    deleteProduct({ id: d.id, page, limit });
  };

  const handleEdit = (d:any) => {
    navigate(path.CREATE_PRODUCT, { state: { ...d, page, limit } });
  };

  return (
    <TableIndex
      titles={[
        { text: '#SL', className: 'w-[100px]' },
        { text: 'Image' },
        { text: 'Name' },
        { text: 'Price' },
        { text: 'Stock' },
        { text: 'Category' },
        { text: 'Brand' },
        { text: 'Rating' },
        { text: 'Action', className: 'text-right' },
      ]}
      data={(data?.data || []).map(({ sellPrice, quantity, name, category, brand, rating, images, ...props }, index) => ({ ...props, '#SL': ((index + 1) + (page * limit)), avatar: images[0], name, price: sellPrice, Stock: quantity, Category: category.name, Brand: brand.name, rating, action: 'action', images }))}
      caption="A list of your all Category"
      activePage={(page + 1)}
      totalPage={data?.total_page}
      handleNextPage={handleNext}
      handlePrevuesPage={handlePrevuesPage}
      handlePageNumber={handlePageNumber}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      cellStyle={{
        className: ['rounded-sm'],
        value: ['avatar'],
      }}
    />
  );
}
