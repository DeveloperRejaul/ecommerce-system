import { useForm } from 'react-hook-form';
import { ChangeEvent, createRef, useState } from 'react';
import { useAppSelector } from '@/core/hooks/rtk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormMessage, Form, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { capitalizeEachWord, debounce } from '@/core/lib/utils';
import { useUpdateUserMutation } from '../users/api';
import { uploadFile, urlConvert } from '@/core/lib/file';

export default function SuperAdmin() {
  const { id, name, address, avatar, email, role } = useAppSelector((state) => state.user);
  const [updateUser] = useUpdateUserMutation();
  const [isUpdate, setIsUpdate] = useState(false);

  // image data upload state
  const [file, setFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<(File | null)[]>([]);

  const fileInputRef = createRef<HTMLInputElement>();

  const form = useForm({
    defaultValues: {
      name,
      email,
      address,
      role,
    },
  });

  const handleAvatarClick = () => {
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

  const handleSubmit = async (d:any) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const img = await uploadFile(formData);
      d.avatar = img.url;
    }
    updateUser({ ...d, id });
  };

  const handleUpdateButton = debounce(() => (isUpdate ? null : setIsUpdate(true)), 500);

  return (
    <div className="py-10 flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex justify-center items-center w-full">
            <Avatar className="h-[90px] w-[90px] cursor-pointer" onClick={() => handleAvatarClick()}>
              {file ? <AvatarImage src={URL.createObjectURL(file)} alt="@shadcn" /> : avatar ? <AvatarImage src={urlConvert(avatar)} alt="@shadcn" /> : <AvatarFallback>AV</AvatarFallback>}
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
              <FormItem className="pt-2">
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
          <FormField
            control={form.control}
            name="role"
            render={({ field: { onChange, value, ...props } }) => (
              <FormItem className="pb-2">
                <FormControl>
                  <Input
                    disabled
                    className="!border-0 text-center text-sm"
                    onChange={(v) => {
                      handleUpdateButton();
                      onChange(v);
                    }}
                    value={capitalizeEachWord(value || '')}
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
                      disabled
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
            {isUpdate && <Button className="flex flex-1 w-full bg-zinc-800 text-white hover:bg-zinc-700 transition duration-500">Update</Button>}
          </div>
        </form>
      </Form>
    </div>
  );
}
