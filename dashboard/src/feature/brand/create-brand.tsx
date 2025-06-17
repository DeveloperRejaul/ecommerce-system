/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
import { createRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/core/hooks/rtk';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/core/lib/file';
import { useCreateBrandMutation, useUpdateBrandMutation } from './api';
import { clearEmptyObject } from '@/core/lib/utils';
import { BtnLoading } from '@/components/loading';

export default function CreateBrand() {
  const { state } = useLocation();
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const isUpdate = state !== null;
  const shopId = useAppSelector((state) => state.user.shopId);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = createRef<HTMLInputElement>();
  const form = useForm({
    defaultValues: { name: state?.name || '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCreateCategory = async (data: { name: string; }) => {
    const formData = new FormData();

    if (isUpdate) {
      const updateData = { id: state.id, name: data.name, page: state.page, limit: state.limit, shopId, avatar: '' };
      if (file) {
        formData.append('file', file);
        const img = await uploadFile(formData);
        updateData.avatar = img.url;
      }
      updateBrand(clearEmptyObject(updateData));
      return;
    }

    if (file) {
      formData.append('file', file);
      const avatar = await uploadFile(formData);
      createBrand({ avatar: avatar.url, shopId, name: data.name });
      // clear input
      setFile(null);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateCategory)} className="grid gap-4 py-4 px-10">
        {/* avatar part */}
        <div className="flex justify-center items-center w-full">
          <Avatar className="h-[90px] w-[90px] cursor-pointer" onClick={handleAvatarClick}>
            {file ? <AvatarImage src={URL.createObjectURL(file)} alt="@shadcn" /> : isUpdate ? <AvatarImage src={state.avatar} alt="@shadcn" /> : <AvatarFallback>AV</AvatarFallback>}
            <Input
              id="picture"
              type="file"
              style={{ display: 'none', height: '100%', width: '100%' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </Avatar>
        </div>
        {/* name part */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Type your category name" className="col-span-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary">
          <div className="cursor-pointer">
            {isLoading ? <BtnLoading /> : <span>{isUpdate ? 'Update' : 'Create'}</span>}
          </div>
        </Button>
      </form>
    </Form>
  );
}
