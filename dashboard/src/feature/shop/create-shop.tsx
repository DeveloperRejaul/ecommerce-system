/* eslint-disable react-compiler/react-compiler */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React, { createRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BtnLoading } from '@/components/loading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateShopMutation, useUpdateShopMutation } from '@/feature/shop/api';
import { uploadFile, uploadFiles } from '@/core/lib/file';
import schema from './schema';
import ImgPacker, { ImgPackerRef } from '@/components/img-packer';
import { Label } from '@/components/ui/label';
import { useGetAllUsersQuery } from '../users/api';
import DateTimePicker from '@/components/date-time';
import { clearEmptyObject } from '@/core/lib/utils';

export default function CreateShop() {
  const imagePackerRef = useRef<ImgPackerRef>({} as ImgPackerRef);
  const datePackerRef = useRef<{reset:()=> void}>({} as {reset:()=> void});
  const { data } = useGetAllUsersQuery({ page: 0, limit: 1000 });
  const [file, setFile] = useState <File[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [createShop, { isLoading: createShopLoading }] = useCreateShopMutation();
  const [updateShop, { isLoading: updateShopLoading }] = useUpdateShopMutation();
  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = createRef<HTMLInputElement>();
  const { state } = useLocation();
  const isUpdate = state !== null;

  const roles = isUpdate ? {} : { resolver: zodResolver(schema) };
  const form = useForm({
    ...roles,
    defaultValues: { email: state?.email || '', name: state?.name || '', address: state?.address || '', userId: state?.userId || '', expireDate: state?.expireDate || '', price: state?.price || '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) setAvatar(event.target.files[0]);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const avatarSrc = avatar ? URL.createObjectURL(avatar) : `${(state || {})?.avatar}`;

  const handleCreateShop = async (data:z.infer<typeof schema > & {avatar?: string, banner: string[]}) => {
    setLoading(true);
    if (avatar) {
      const formData = new FormData();
      formData.append('file', avatar);
      const img = await uploadFile(formData);
      data.avatar = img.url;
    }

    // @ts-ignore
    if (data?.price) data.price = Number(data.price);
    if (file.length > 0) {
      const formData = new FormData();
      file.forEach((fl) => {
        if (fl) formData.append('files', fl);
      });
      const imgs = await uploadFiles(formData);
      data.banner = imgs.urls;
    }

    if (isUpdate) {
      updateShop(clearEmptyObject({ ...data, id: (state || {})?.id }));
      setLoading(false);
      return;
    }
    createShop(data);
    // clear input
    setLoading(false);
    form.reset();
    setAvatar(null);
    imagePackerRef.current?.reset();
    datePackerRef.current?.reset();
  };

  return (
    <Form {...form}>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(handleCreateShop)} className="grid gap-4 py-4 px-6">
        <div className="flex justify-center items-center w-full">
          <Avatar className="h-[90px] w-[90px] cursor-pointer" onClick={handleAvatarClick}>
            {avatarSrc && <AvatarImage src={avatarSrc} alt="@shadcn" />}
            <Input id="picture" type="file" style={{ display: 'none', height: '100%', width: '100%' }} ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
        </div>
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input id="email" placeholder="demo@gmail.com" type="email" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input id="address" placeholder="Type you address" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Select Shop name */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-[200px] rounded-md border-t p-4">
                    {data?.data?.filter((u) => u.shopId === null)?.map((d, i: number) => <SelectItem key={Math.random() * i} value={d.id}>{d.name}</SelectItem>)}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* expireDate */}
        <FormField
          control={form.control}
          name="expireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expire Date</FormLabel>
              <FormControl>
                <DateTimePicker {...field} ref={datePackerRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Price  */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" id="price" placeholder="Type shop price" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* banner part */}
        <div className="space-y-2">
          <Label>Shop banners</Label>
          <ImgPacker ref={imagePackerRef} onChange={(fl) => setFile(fl)} images={state?.banner} />
        </div>
        <Button type="submit" className="px-8">
          <div>
            {(isLoading || createShopLoading || updateShopLoading) ? <BtnLoading /> : <p>{ isUpdate ? 'Update' : 'Create'}</p>}
          </div>
        </Button>
      </form>
    </Form>
  );
}
