
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateCategoryMutation } from './api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { z } from 'zod';
import { createRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './schema';
import { BtnLoading } from '@/components/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IShopTypes } from '../shop/types';
import { useGetShopQuery } from '../shop/api';
import { useAppSelector } from '@/core/hooks/rtk';
import { UserRole } from '@/core/constant/constant';

export default function DialogContent() {
    const [createCategory, res] = useCreateCategoryMutation();
    const role = useAppSelector(state => state.user.role);
    const shopId = useAppSelector(state => state.user.shopId);
    const { data } = useGetShopQuery(undefined);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = createRef<HTMLInputElement>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", shop: "" },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const avatarSrc = file && URL.createObjectURL(file);


    const handleCreateCategory = (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();

        const shop = role === UserRole.OWNER ? data.shop : shopId;
        formData.append('name', data.name);
        formData.append('shopId', shop);
        if (file) formData.append('avatar', file);
        createCategory(formData);
        // clear input
        form.reset();
    };


    return <Form {...form}>
        <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
                Create Category. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreateCategory)} className="grid gap-4 py-4">
            {/* avatar part */}
            <div className='flex justify-center items-center w-full'>
                <Avatar className='h-[90px] w-[90px] cursor-pointer' onClick={handleAvatarClick}>
                    {avatarSrc && <AvatarImage src={avatarSrc} alt="@shadcn" />}
                    <Input
                        id="picture" type="file" style={{ display: "none", height: "100%", width: "100%" }}
                        ref={fileInputRef} onChange={handleFileChange} accept='image/*'
                    />
                    <AvatarFallback>AV</AvatarFallback>
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
                            <Input id="name" placeholder='Jon Due' className="col-span-3"  {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

            {/* Select Shop name */}
            {role === UserRole.OWNER && <FormField
                control={form.control}
                name="shop"
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
                                    <Input type="search" id="search" placeholder="Search..." />
                                    {data?.map((d: IShopTypes, i: number) => <SelectItem key={Math.random() * i} value={d._id}>{d.name}</SelectItem>)}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />}
            <DialogFooter>
                <Button type="submit" className='px-8'>
                    <div>
                        {res.isLoading ? <BtnLoading /> : <p>Create</p>}
                    </div>
                </Button>
            </DialogFooter>
        </form>
    </Form>;
}
