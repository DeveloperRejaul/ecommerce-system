import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole } from '@/core/constant/constant';
import { useAppSelector } from '@/core/hooks/rtk';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createRef, useState } from 'react';
import { useGetShopQuery } from '../shop/api';
import { IShopTypes } from '../shop/types';
import { BtnLoading } from '@/components/loading';
import { useCreateUserMutation } from './api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './schema';
import { z } from 'zod';


export default function CreateUser() {
    const role = useAppSelector(state => state.user.role);
    const { data } = useGetShopQuery(undefined);
    const [createUser, res] = useCreateUserMutation();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = createRef<HTMLInputElement>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', name: '', role: '', shop: "", password: "", address: "" },
    });
    const { OWNER, SUPER_ADMIN, ADMIN, MODERATOR, USER } = UserRole;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const avatarSrc = file && URL.createObjectURL(file);


    const handleCreateUser = (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('name', data.name);
        formData.append('role', data.role);
        formData.append('shopId', data.shop);
        formData.append('password', data.password);
        formData.append('address', data.address);
        if (file) formData.append('avatar', file);

        createUser(formData);
        // clear input
        form.reset();
    };

    return (
        <Form {...form}>
            <DialogHeader>
                <DialogTitle>Create user</DialogTitle>
                <DialogDescription>
                    Create users if you need. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateUser)} className="grid gap-4 py-4">
                <div className='flex justify-center items-center w-full'>
                    <Avatar className='h-[90px] w-[90px] cursor-pointer' onClick={handleAvatarClick}>
                        {avatarSrc && <AvatarImage src={avatarSrc} alt="@shadcn" />}
                        <Input id="picture" type="file" style={{ display: "none", height: "100%", width: "100%" }} ref={fileInputRef} onChange={handleFileChange} accept='image/*' />
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
                                <Input id="name" placeholder='Jon Due' className="col-span-3"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input id="name" placeholder='******' type='password' className="col-span-3"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input id="address" placeholder='Type you address' className="col-span-3"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
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
                                    {[OWNER].map(d => d.toString()).includes(role) && <SelectItem value={SUPER_ADMIN}> Super Admin</SelectItem>}
                                    {[OWNER, SUPER_ADMIN].map(d => d.toString()).includes(role) && <SelectItem value={ADMIN}> Admin</SelectItem>}
                                    {[OWNER, SUPER_ADMIN, ADMIN].map(d => d.toString()).includes(role) && <SelectItem value={MODERATOR}> Moderator</SelectItem>}
                                    {[OWNER, SUPER_ADMIN, ADMIN, USER].map(d => d.toString()).includes(role) && <SelectItem value={USER}> User</SelectItem>}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Select Shop name */}
                <FormField
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
                />
                <DialogFooter>
                    <Button type="submit" className='px-8'>
                        <Button type="submit" className='px-8'>
                            <div>
                                {res.isLoading ? <BtnLoading /> : <p>Create</p>}
                            </div>
                        </Button>
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
