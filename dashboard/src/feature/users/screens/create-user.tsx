/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React, { createRef, useState } from 'react';
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
import { UserRole, userRoleValue } from '@/core/constant/constant';
import { useAppSelector } from '@/core/hooks/rtk';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BtnLoading } from '@/components/loading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateUserMutation, useUpdateUserMutation } from '../api';
import createSchema from '../schema';
import { useGetShopQuery } from '@/feature/shop/api';
import { IShopTypes } from '@/feature/shop/types';
import { uploadFile } from '@/core/lib/file';
import { clearEmptyObject } from '@/core/lib/utils';

export default function CreateUser() {
  const { role, shopId } = useAppSelector((state) => state.user);
  const { data } = useGetShopQuery({}, { skip: role !== 'OWNER' });
  const [isLoading, setIsLoading] = useState(false);
  const [createUser, { isLoading: createUserLoading }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = createRef<HTMLInputElement>();
  const { state } = useLocation();
  const isUpdate = state !== null;

  const roles = isUpdate ? {} : { resolver: zodResolver(createSchema) };
  const form = useForm({
    ...roles,
    defaultValues: { email: state?.email || '', name: state?.name || '', role: state?.role || '', shopId: state?.shopId || '', password: '', address: state?.address || '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const avatarSrc = file ? URL.createObjectURL(file) : `${(state || {})?.avatar}`;

  const handleCreateUser = async (data:z.infer<typeof createSchema > & {avatar?: string}) => {
    setIsLoading(true);
    if (role !== 'OWNER') data.shopId = shopId;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const img = await uploadFile(formData);
      data.avatar = img.url;
    }
    createUser(clearEmptyObject(data));
    setIsLoading(false);
    // clear input
    form.reset();
    setFile(null);
  };

  const handleUpdate = async (data:z.infer<typeof createSchema > & {avatar?: string}) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const img = await uploadFile(formData);
      data.avatar = img.url;
    }
    updateUser({ ...data, id: (state || {})?.id });
  };

  return (
    <Form {...form}>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(isUpdate ? handleUpdate : handleCreateUser)} className="grid gap-4 py-4 px-6">
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
        {isUpdate || (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input id="password" placeholder="******" type="password" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        )}
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
        {/* Select User Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(userRoleValue).map((key) => {
                    if (userRoleValue[(role || 'USER')] > userRoleValue[key as UserRole]) {
                      return (
                        <SelectItem value={key}>
                          {key}
                        </SelectItem>
                      );
                    }
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Shop name */}
        {role === 'OWNER' && (
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
                  <ScrollArea className="h-[200px] rounded-md border-t p-4">
                    {data?.data?.map((d: IShopTypes, i: number) => <SelectItem key={Math.random() * i} value={d.id}>{d.name}</SelectItem>)}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        )}
        <Button type="submit" className="px-8">
          {(isLoading || createUserLoading) ? <BtnLoading /> : <p>{ isUpdate ? 'Update' : 'Create'}</p>}
        </Button>
      </form>
    </Form>
  );
}
