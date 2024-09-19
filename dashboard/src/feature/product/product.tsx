import { useGetAllProductQuery } from './api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductType } from './types';
import { BASE_URL } from '@/core/constant/constant';
import { SquarePen, Star, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { path } from '@/core/router/router';
import Image from '@/components/image';

export default function Product() {
    const product = useGetAllProductQuery(undefined);
    const navigate = useNavigate();

    const handleDeleteProduct = () => { };

    return <Table>
        <TableCaption>A list of your all Product.</TableCaption>
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
            {product.data?.map((d: ProductType, i: number) => {
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
                                    onClick={handleDeleteProduct} />
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
    </Table >;
}
