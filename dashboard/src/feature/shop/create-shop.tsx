import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/hooks/rtk';
import React, { createRef, useState } from 'react';
import { useCreateShopMutation } from './api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formSchema } from './schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BtnLoading } from '@/components/loading';

export default function CreateShop() {
    const userId = useAppSelector(state => state.user.id);
    const [createShop, res] = useCreateShopMutation();

    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = createRef<HTMLInputElement>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', name: '', address: '' },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const avatarSrc = file && URL.createObjectURL(file);



    const handleCreateShop = (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('name', data.name);
        formData.append('address', data.address);
        formData.append('email', data.email);
        if (file) formData.append('avatar', file);
        createShop(formData);

        // clear input
        form.reset();
    };



    return (
        <Form {...form}>
            <DialogHeader>
                <DialogTitle>Create Shop</DialogTitle>
                <DialogDescription>
                    Create shops. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateShop)} className="grid gap-4 py-4">
                {/* avatar part */}
                <div className='flex justify-center items-center w-full'>
                    <Avatar className='h-[90px] w-[90px] cursor-pointer' onClick={handleAvatarClick}>
                        {avatarSrc && <AvatarImage src={avatarSrc} alt="@shadcn" />}
                        <Input id="picture" type="file" style={{ display: "none", height: "100%", width: "100%" }} ref={fileInputRef} onChange={handleFileChange} accept='image/*' />
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
                {/* email part */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input id="email" placeholder='demo@gmail.com' type='email' className="col-span-3"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                {/* address part */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input id="address" placeholder={`Cox's Bazar`} type='text' className="col-span-3"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <DialogFooter>
                    <Button type="submit" className='px-8'>
                        <div>
                            {res.isLoading ? <BtnLoading /> : <p>Login</p>}
                        </div>
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
