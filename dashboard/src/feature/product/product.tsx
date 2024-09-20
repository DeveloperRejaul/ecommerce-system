import { useDeleteProductMutation, useGetAllProductQuery } from './api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductType } from './types';
import { BASE_URL } from '@/core/constant/constant';
import { SquarePen, Star, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { path } from '@/core/router/router';
import Image from '@/components/image';
import Alert from '@/components/Alert';
import { useState } from 'react';
import Pagination from '@/components/pagination';

const limit = 10;
let skip = 0;
let activePage = 1;

export default function Product() {
    const product = useGetAllProductQuery({ limit, skip });
    const [deleteProduct] = useDeleteProductMutation();
    const navigate = useNavigate();

    const [isAlert, setIsAlert] = useState(false);
    const [productId, setProductId] = useState<string>();

    // handle items deletes
    const handleDeleteProduct = (itemsId: string) => {
        setProductId(itemsId);
        setIsAlert(true);
    };

    const handleDeleteAction = (type: 'cancel' | 'continue') => {
        if (type === "cancel") return setIsAlert(false);
        if (productId) {
            deleteProduct(productId);
            setIsAlert(false);
        };
    };


    // handle next page
    const handleNext = () => {
        if (skip <= product.data.total_page) {
            skip = (limit + skip);
            product.refetch();
            activePage += 1;
        }
    };

    // handle previous page
    const handlePrevious = () => {
        if (skip >= 1) {
            skip = skip - limit;
            product.refetch();
            activePage -= 1;
        }
    };

    // handle page number
    const handlePageNumber = (pageNum: number) => {
        skip = ((pageNum - 1) * limit);
        activePage = pageNum;
        product.refetch();
    };

    return <>
        <Alert
            isOpen={isAlert}
            handleActin={handleDeleteAction}
            message='This action cannot be undone. This will permanently delete your product and remove your data from database.' />
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product Name & Size</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className='text-right'>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {product.data?.data.map((d: ProductType, i: number) => {
                    const sizes = Object.keys(d.size);
                    const imageUrl = `${BASE_URL}/file/${d.images[0]}`;
                    return (
                        <TableRow key={Math.random() * i}>
                            <TableCell>

                                <div className='flex items-center space-x-2'>
                                    <div className='overflow-hidden' style={{ borderRadius: 7 }}>
                                        <Image src={imageUrl} alt='IMG' className='h-20 w-20 object-cover' />
                                    </div>
                                    <div>
                                        <p
                                            className='cursor-pointer'
                                            onClick={() => navigate(`${path.PRODUCT}/${d._id}`)}>
                                            {d.name || "Black T-shirt "}
                                        </p>
                                        <p className='text-gray-400'>Size: {sizes.map(d => <span key={d}> {d.toUpperCase()}</span>)} </p>
                                    </div>

                                </div>
                            </TableCell>
                            <TableCell>{Math.ceil(Number(d.sellPrice))} </TableCell>
                            <TableCell>{d.quantity} Item </TableCell>
                            <TableCell>{d.categoryId.name}</TableCell>
                            <TableCell>
                                <div className='flex items-center gap-x-1'>
                                    <Star className='fill-yellow-300 stroke-none' />
                                    <p>{d.rating || "0.00"} </p>
                                    <p className='ml-1'>{d.rating || '00 Review'} </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className='flex justify-end space-x-2'>
                                    <TrashIcon
                                        className='text-gray-400  cursor-pointer transition-all hover:text-red-500'
                                        height={28}
                                        width={28}
                                        onClick={() => handleDeleteProduct(d._id)} />
                                    <SquarePen
                                        className='text-gray-400  cursor-pointer transition-all hover:text-blue-400'
                                        height={25}
                                        width={25}
                                        onClick={() => navigate(path.PRODUCT_EDIT, { state: d })} />
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table >
        <Pagination
            totalPage={product.data?.total_page || 0}
            handleNext={handleNext}
            handlePrevues={handlePrevious}
            activePageNumber={activePage}
            handlePageNumber={handlePageNumber}
        />
        <p className='py-3 text-muted-foreground text-center'>A list of your all Product</p>
    </>;
}
