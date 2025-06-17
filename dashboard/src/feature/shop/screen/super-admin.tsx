/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import { useForm } from 'react-hook-form';
import { ChangeEvent, createRef, useEffect, useState } from 'react';
import { useAppSelector } from '@/core/hooks/rtk';
import { useGetShopByIdQuery, useUpdateShopMutation } from '../api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormMessage, Form, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { debounce } from '@/core/lib/utils';
import { uploadFile, uploadFiles } from '@/core/lib/file';
import ImgPacker from '@/components/img-packer';

export default function SuperAdmin() {
  const shopId = useAppSelector((state) => state.user.shopId);

  const { data, isLoading, isSuccess } = useGetShopByIdQuery({ id: shopId });
  const [updateShop] = useUpdateShopMutation();
  const [isUpdate, setIsUpdate] = useState(false);

  // image data upload state
  const [file, setFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<(File | null)[]>([]);

  const fileInputRef = createRef<HTMLInputElement>();
  const bannerInputRefs = [createRef<HTMLInputElement>(), createRef<HTMLInputElement>(), createRef<HTMLInputElement>(), createRef<HTMLInputElement>(), createRef<HTMLInputElement>()];

  const form = useForm({
    defaultValues: {
      name: data?.name,
      email: data?.email,
      address: data?.address,
    },
  });

  useEffect(() => {
    if (data && isSuccess) {
      form.setValue('name', data.name);
      form.setValue('email', data.email);
      form.setValue('address', data.address);
    }
  }, [data, form, isSuccess]);

  const handleAvatarClick = (index?: number) => {
    if (typeof index !== 'undefined' && index >= 0 && bannerInputRefs[index].current) {
      bannerInputRefs[index].current.click();
      return;
    }
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, index?:number) => {
    if (!isUpdate) setIsUpdate(true);
    if (typeof index !== 'undefined' && index >= 0 && event.target.files && event.target.files[0]) {
      const arr = [...bannerFile];
      arr[index] = event.target.files[0];
      setBannerFile(arr);
      return;
    }
    if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
  };

  const handleSubmit = async (d: any) => {
    const formData = new FormData();
    const formData2 = new FormData();
    const shopData = { ...d, id: shopId };
    try {
      if (file) {
        formData.append('file', file);
        const img = await uploadFile(formData);
        shopData.avatar = img.url;
      }
      if (bannerFile.length > 0) {
        bannerFile.forEach((fl) => {
          if (fl) formData2.append('files', fl);
        });
        const imgs = await uploadFiles(formData2);
        shopData.banner = imgs.urls;
      }
      updateShop(shopData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateButton = debounce(() => (isUpdate ? null : setIsUpdate(true)), 500);

  if (isLoading) return <h1>Loading ..</h1>;

  return (
    <div className="py-10 flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex justify-center items-center w-full">
            <Avatar className="h-[90px] w-[90px] cursor-pointer" onClick={() => handleAvatarClick()}>
              {file ? <AvatarImage src={URL.createObjectURL(file)} alt="@shadcn" /> : data?.avatar ? <AvatarImage src={data?.avatar} alt="@shadcn" /> : <AvatarFallback>AV</AvatarFallback>}
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
          <FormField
            control={form.control}
            name="name"
            render={({ field: { onChange, ...props } }) => (
              <FormItem className="py-2">
                <FormControl>
                  <Input
                    className="!border-0 text-center text-xl font-bold"
                    onChange={(value) => {
                      handleUpdateButton();
                      onChange(value);
                    }}
                    {...props}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="border">
            <FormField
              control={form.control}
              name="email"
              render={({ field: { onChange, ...props } }) => (
                <FormItem className="flex items-center gap-x-4 px-6 border-b">
                  <FormLabel className="mt-2">Email: </FormLabel>
                  <FormControl>
                    <Input
                      className="!border-0 px-0"
                      onChange={(value) => {
                        handleUpdateButton();
                        onChange(value);
                      }}
                      {...props}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field: { onChange, ...props } }) => (
                <FormItem className="flex items-center gap-x-4 px-6">
                  <FormLabel className="mt-2">Address: </FormLabel>
                  <FormControl>
                    <Input
                      className="!border-0 px-0"
                      onChange={(value) => {
                        handleUpdateButton();
                        onChange(value);
                      }}
                      {...props}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <h2>Banner</h2>
            <div className="flex justify-center items-center w-full gap-x-3 pb-6">
              <ImgPacker
                onChange={(fl) => { setBannerFile(fl); setIsUpdate(true); }}
                images={data?.banner}
              />
            </div>
            {isUpdate && <Button className="flex flex-1 w-full bg-zinc-800 text-white hover:bg-zinc-700 transition duration-500">Update</Button>}
          </div>
        </form>
      </Form>
    </div>
  );
}
