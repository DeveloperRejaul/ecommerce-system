import { z } from 'zod';
import React, { createRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formSchema } from '../schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/core/hooks/rtk';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/core/lib/file';
import { clearEmptyObject } from '@/core/lib/utils';
import { BtnLoading } from '@/components/loading';

export default function CreateCategory() {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const { state } = useLocation();
  const isUpdate = state !== null;

  const shopId = useAppSelector((state) => state.user.shopId);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = createRef<HTMLInputElement>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: state?.name || '', discount: state?.discount || '0', type: state?.type || '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCreateCategory = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    if (isUpdate) {
      const updateData = { id: state.id, name: data.name, discount: Number(data?.discount || '0'), page: state.page, limit: state.limit, avatar: '' };
      if (file) {
        formData.append('file', file);
        const img = await uploadFile(formData);
        updateData.avatar = img.url;
      }
      updateCategory(clearEmptyObject(updateData));
      return;
    }

    if (file) {
      formData.append('file', file);
      const avatar = await uploadFile(formData);
      createCategory({ type: data.type, avatar: avatar.url, shopId, name: data.name, discount: Number(data?.discount || '0') });
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

        {/* discount type */}
        <FormField
          control={form.control}
          name="discount"
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input id="discount" placeholder="Type number of discount" className="col-span-3" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* category type   */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category type" />
                    <SelectContent>
                      <SelectItem value="ROUNDED">ROUNDED</SelectItem>
                      <SelectItem value="SQUARE"> SQUARE</SelectItem>
                      <SelectItem value="TOP_SELECTION"> TOP_SELECTION</SelectItem>
                      <SelectItem value="HIDE"> HIDE</SelectItem>
                    </SelectContent>
                  </SelectTrigger>
                </FormControl>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="secondary">
          <div className="cursor-pointer">
            {isLoading ? <BtnLoading/> : <span>{isUpdate ? 'Update' : 'Create'}</span>}
          </div>
        </Button>
      </form>
    </Form>
  );
}
