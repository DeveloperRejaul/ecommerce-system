/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-compiler/react-compiler */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-multi-assign */
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ICategoryType } from '../category/types';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/core/hooks/rtk';
import { Label } from '@/components/ui/label';
import ImgPacker, { ImgPackerRef } from '../../components/img-packer';
import formSchema from './schema';
import { useGetAllBrandQuery } from '../brand/api';
import { useCreateProductMutation, useUpdateProductMutation } from './api';
import { useGetAllCategoryQuery } from '../category/api';
import { useGetCouponQuery } from '../coupon/api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { uploadFiles } from '@/core/lib/file';
import { addPercentage, calculateDiscountWithPercentage, getPercentageOfProfit } from '@/core/lib/persentis';
import { specificationToString, stringToSpecification } from '@/core/lib/string';
import Plus from '@/assets/icon/Plus';

export default function CreateProduct() {
  const imagePackerRef = useRef<ImgPackerRef>({} as ImgPackerRef);
  const { state } = useLocation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [file, setFile] = useState <File[]>([]);
  const [discountRadio, setDiscountRadio] = useState('1');
  const { data: brand } = useGetAllBrandQuery({ page: 0, limit: 1000 });
  const { data: category } = useGetAllCategoryQuery({ page: 0, limit: 1000 });
  const { data: coupon } = useGetCouponQuery({ limit: 1000, page: 0 });
  const shopId = useAppSelector((s) => s.user.shopId);
  const isUpdate = state !== null;

  const profitPercentage = getPercentageOfProfit(state?.buyPrice || 0, state?.price || 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: state?.name || '', title: state?.title || '', description: state?.description || '', brandId: state?.brandId || '', buyPrice: state?.buyPrice || '', categoryId: state?.categoryId || '', couponId: state?.couponId || '', quantity: state?.Stock || '', sellPrice: profitPercentage ? profitPercentage.toString() : '', discount: state?.discount || '', keys: state?.keys || '', specification: stringToSpecification(state?.specification || '') },
  });
  const { fields, append } = useFieldArray({ name: 'specification', control: form.control });

  const onSubmit = async (data: z.infer<typeof formSchema> & {images?: string[]}) => {
    const formData = new FormData();
    if (file.length > 0) {
      file.forEach((fl) => {
        if (fl) formData.append('files', fl);
      });
      const imgs = await uploadFiles(formData);
      data.images = imgs.urls;
    }
    const totalSellPrice = addPercentage(+data.buyPrice, +data.sellPrice);
    const specification = specificationToString(data?.specification || []);

    if (isUpdate) {
      updateProduct({ ...data, id: state?.id, page: state?.page, limit: state?.limit, buyPrice: +data.buyPrice, sellPrice: totalSellPrice, quantity: +data.quantity, discount: discountRadio === '1' ? +data.discount : calculateDiscountWithPercentage(totalSellPrice, +data.discount), shopId, specification });
      return;
    }
    createProduct({ ...data, buyPrice: +data.buyPrice, sellPrice: totalSellPrice, quantity: +data.quantity, discount: discountRadio === '1' ? +data.discount : calculateDiscountWithPercentage(totalSellPrice, +data.discount), shopId, specification });

    // reset form
    form.reset();
    setFile([]);
    setDiscountRadio('1');
    imagePackerRef.current?.reset();
  };

  return (
    <div className="flex flex-1 flex-col px-2 ">
      <h1 className="text-2xl">
        { isUpdate ? 'Update' : 'Create'}
        {' '}
        Product
      </h1>
      <Form {...form}>
        <form className="grid gap-y-4 lg:gap-x-6 lg:grid-cols-1" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Type product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type product description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* specification part */}
          <Label>Specification</Label>
          {fields.map((field, index) => (
            <div className="flex space-x-3 items-center" key={field.id}>
              <Input
                placeholder="Type title"
                className="w-[30%]"
                {...form.register(`specification.${index}.title`)}
              />
              <Input
                placeholder="Type details"
                {...form.register(`specification.${index}.description`)}
              />
              {index === fields.length - 1 ? (
                <div
                  className="cursor-pointer border h-12 w-16 rounded-full bg-zinc-800 hover:bg-zinc-700 flex justify-center items-center"
                  onClick={() => append({ title: '', description: '' })}
                >
                  <Plus />
                </div>
              ) : (
                <div className="h-12 w-16" />
              )}
            </div>
          ))}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {category?.data?.map((d: ICategoryType) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Type product quantity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Type product buy price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coupon Id  */}
          <FormField
            control={form.control}
            name="couponId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Coupon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coupon?.data?.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand select part */}
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brand?.data?.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* profit */}
          <FormField
            control={form.control}
            name="sellPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profit of Percentage </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Percentage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => i + 1).map((e) => (
                      <SelectItem key={e} value={(e).toString()}>
                        {e}
                        %
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* discount part */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount </FormLabel>
                <RadioGroup
                  defaultValue="1"
                  className="flex gap-x-7"
                  onValueChange={setDiscountRadio}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="r1" />
                    <Label htmlFor="r2">Fix</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="r2" />
                    <Label htmlFor="r3">Present</Label>
                  </div>
                </RadioGroup>
                {discountRadio === '1' ? (
                  <FormControl>
                    <Input type="number" placeholder="Type number of discount" {...field} />
                  </FormControl>
                ) : (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Percentage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 100 }, (_, i) => i + 1).map((e) => (
                        <SelectItem key={e} value={(e).toString()}>
                          {e}
                          %
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Key part */}
          <FormField
            control={form.control}
            name="keys"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keys</FormLabel>
                <FormControl>
                  <Input placeholder="Type product key with coma separated" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Product Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <ImgPacker ref={imagePackerRef} onChange={(fl) => setFile(fl)} images={state?.images} />
          </div>
          <Button type="submit">{isUpdate ? 'Update Product' : 'Create Product'}</Button>
        </form>
      </Form>
    </div>
  );
}
