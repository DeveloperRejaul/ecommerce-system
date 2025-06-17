/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateCouponMutation, useUpdateCouponMutation } from './api';
import formSchema from './schema';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/core/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/core/hooks/rtk';
import { UserRole } from '@/core/constant/constant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetShopQuery } from '../shop/api';
import { IShopTypes } from '../shop/types';
import MultiSelect from '@/components/maltySelect';
import { useGetAllCategoryQuery } from '../category/api';
import CalendarIcon from '@/assets/icon/CalendarIcon';

export default function CreateCoupon() {
  const { state } = useLocation();
  const isUpdate = state !== null;
  const [categorysId, setCategorysId] = useState(isUpdate ? state.categorysId : []);
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const category = useGetAllCategoryQuery({ page: 0, limit: 1000 });
  const shopRes = useGetShopQuery(undefined);
  const [activeType, setActiveType] = useState<'FIX' | 'PERCENT'>(state?.type || 'FIX');
  const { role, shopId } = useAppSelector((state) => state.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: state?.type || 'FIX', name: state?.name || '', quantity: state?.quantity, value: `${state?.value}` },
  });
  const [date, setDate] = useState<DateRange | undefined>({
    from: state?.time?.from || new Date(),
    to: state?.time?.to || addDays(new Date(), 20),
  });

  const handleCreateCoupon = (data: z.infer<typeof formSchema>) => {
    const { name, type, quantity, value } = data;

    if (!isUpdate) {
      createCoupon({ time: date, shopId, name, type, quantity: +quantity, value: +value, categorysId });
      form.reset();
      return;
    }
    updateCoupon({ time: date, shopId, name, type, quantity: +quantity, value: +value, categorysId, id: state.id, page: state.page, limit: state.limit });
  };

  // loading handle
  if (category.isLoading) return <h1>Loading...</h1>;

  const defaultSelectedCategory = isUpdate ? (category.data?.data || []).filter((ele) => state.categorysId.includes(ele.id))?.map((ele) => ({ label: ele.name, value: ele.id })) : [];
  const categoryData = (isUpdate ? (category.data?.data || []).filter((ele) => !state.categorysId.includes(ele.id)) : category.data?.data || []).map((ele) => ({ label: ele.name, value: ele.id }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateCoupon)} className="grid gap-4 py-4 px-6">
        {/* name part */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Jon Due" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* coupon type part */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(value: 'FIX' | 'PERCENT') => {
                  field.onChange(value); setActiveType(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coupon type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PERCENT">Percent</SelectItem>
                  <SelectItem value="FIX">Fix</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input id="quantity" placeholder="00000" type="number" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Coupon value field */}
        {activeType === 'FIX' && (
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Price</FormLabel>
              <FormControl>
                <Input id="value" placeholder="00000" type="number" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        )}
        {activeType === 'PERCENT' && (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount present</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select percent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {new Array(100).fill(0).map((_, i) => i + 1).map((d) => <SelectItem key={d} value={d.toString()}>{`${d}%`}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* Date Time Field */}
        <Label>Date Time</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')}
                    {' '}
                    -
                    {' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {role === UserRole.OWNER && (
        <FormField
          control={form.control}
          name="shopId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a shop" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="max-h-[200px] rounded-md border-t p-4">
                    <Input type="search" id="search" placeholder="Search..." />
                    {shopRes.data?.map((d: IShopTypes, i: number) => <SelectItem key={Math.random() * i} value={d.id}>{d.name}</SelectItem>)}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        )}
        {/* Category Field */}
        <Label>Category</Label>
        <MultiSelect
          defaultValue={defaultSelectedCategory}
          data={(categoryData || []) as Record<'label' | 'value', string>[]}
          handleChange={setCategorysId}
        />
        <Button type="submit">{isUpdate ? 'Update' : 'Create'}</Button>
      </form>
    </Form>
  );
}
