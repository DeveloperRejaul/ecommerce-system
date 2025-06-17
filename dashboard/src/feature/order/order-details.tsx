/* eslint-disable max-len */
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateOrderMutation } from './api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus } from '@/core/constant/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetProductByIdsQuery } from '../product/api';
import cardProductPriceCalculate from '@/core/lib/price';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import UserRoundPen from '@/assets/icon/UserRoundPen';

export default function OrderDetails() {
  const { state } = useLocation();
  const [updateOrder] = useUpdateOrderMutation();
  const { data } = useGetProductByIdsQuery(state.products.map((pr: { productId: any; }) => pr?.productId).join(','));

  const [status, setStatus] = useState(state.status);
  const [isEditable, setIsEditable] = useState(false);
  const handleDownloadInvoice = () => {};

  const products = Array.isArray(data) ? data?.map((ele, index) => ({ sellPrice: ele?.sellPrice || 0, discount: ele?.discount || 0, quantity: Number(state.products[index].quantity) || 0 })) : [];
  const { deliveryFee, finalPrice, tax, totalCouponDiscount, totalDiscount, totalItems, totalPrice, totalTax } = cardProductPriceCalculate({ coupon: state?.coupon, products });
  const [address, setAddress] = useState(JSON.parse(state?.address)[0]);
  const form = useForm({
    defaultValues: {
      name: address.name || state.name,
      email: address?.email || state.email,
      phone: address?.phone || '',
      address: address?.address || '',
    },
  });

  const handleStatusUpdate = (d:any) => {
    updateOrder({ id: state.id, page: state.page, limit: state.limit, ...d });
  };

  const handleAddressUpdate = (d:any) => {
    updateOrder({ id: state.id, page: state.page, limit: state.limit, address: JSON.stringify([{ ...address, ...d }]) });
    setAddress({ ...address, ...d });
    setIsEditable(false);
  };

  if (data === null) return <h1> Product Not found</h1>;

  return (
    <div>
      {/* Header part  */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold select-none cursor-pointer">
            ID:
            {' '}
            {' '}
            {state.orderId}
          </h1>
          <h2 className="text-sm text-gray-400">
            Created At:
            {' '}
            {' '}
            <span>{state.time}</span>
          </h2>
        </div>

        <div className="flex items-center gap-x-3">
          <Select
            onValueChange={(value) => {
              handleStatusUpdate({ status: value });
              setStatus(value);
            }}
            value={status}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order status</SelectLabel>
                <SelectItem value={OrderStatus.ON_DELIVERY}>{OrderStatus.ON_DELIVERY}</SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>{OrderStatus.COMPLETED}</SelectItem>
                <SelectItem value={OrderStatus.CANCELED}>{OrderStatus.CANCELED}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="bg-zinc-700 text-white hover:bg-zinc-600"
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button>
        </div>
      </div>

      {/* order info part */}
      <section className="py-10">
        <h3 className="text-xl font-bold pb-2">Order details</h3>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) && data?.map((ele:any, index:number) => (
              <TableRow key={ele?.id || ''}>
                <TableCell>{state?.orderId || ''}</TableCell>
                <TableCell>{ele?.name || ''}</TableCell>
                <TableCell>
                  x
                  {`${state.products[index].quantity}`}
                </TableCell>
                <TableCell>
                  ৳
                  {ele?.sellPrice || 0 + (ele?.discount || 0) }
                </TableCell>
                <TableCell>
                  ৳
                  {(ele?.sellPrice || 0 + (ele?.discount || 0)) * state.products[index].quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </section>

      {/* customer paid part */}
      <section className="pb-10 grid grid-cols-1 gap-x-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold pb-2">Paid by customer </h2>
          <Table>
            <TableHeader className="!border-0">
              <TableRow className="border !border-b-0">
                {/* total products price */}
                <TableHead>Subtotal</TableHead>
                <TableHead>
                  {totalItems}
                  {' '}
                  items
                </TableHead>
                <TableHead>
                  ৳
                  {totalPrice}
                </TableHead>
              </TableRow>
              {/* Tax */}
              <TableRow className="border-x !border-b-0">
                <TableHead>Tax</TableHead>
                <TableHead>
                  {tax}
                  %
                </TableHead>
                <TableHead>
                  +৳
                  {totalTax}
                </TableHead>
              </TableRow>

              {/* Delivery Fee */}
              <TableRow className="border-x !border-b-0">
                <TableHead>Delivery Fee</TableHead>
                <TableHead />
                <TableHead>
                  +৳
                  {deliveryFee}
                </TableHead>
              </TableRow>

              {totalDiscount > 1 && (
              <TableRow className="border-x !border-b-0">
                <TableHead>Discount</TableHead>
                <TableHead />
                <TableHead>
                  -৳
                  {totalDiscount}
                </TableHead>
              </TableRow>
              )}
              {totalCouponDiscount > 1 && (
              <TableRow className="border  border-t-0">
                <TableHead>Coupon Discount</TableHead>
                <TableHead />
                <TableHead>
                  -৳
                  {totalCouponDiscount}
                </TableHead>
              </TableRow>
              )}

              {/* Total Price */}
              <TableRow className="!border-0 !border-t">
                <TableHead>Total Price</TableHead>
                <TableHead />
                <TableHead className="text-xl font-bold text-white">
                  ৳
                  {finalPrice}
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        {/* Customer information */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddressUpdate)}>
            <h2 className="text-xl font-bold pb-2">Customer information</h2>
            <div className="border py-2 px-4 space-y-3 relative">
              <div className="absolute right-0 top-0 m-2 pr-3">
                {isEditable
                  ? (
                    <button
                      className="cursor-pointer bg-zinc-800 px-2 py-1m"
                      type="submit"
                    >
                      Save
                    </button>
                  )
                  : <UserRoundPen className="cursor-pointer" onClick={() => setIsEditable(true)} />}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditable} className="border-0 !px-0 !opacity-100" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditable} className="border-0 !px-0 !opacity-100" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditable} className="border-0 !px-0 !opacity-100" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditable} className="border-0 !px-0 !opacity-100" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
