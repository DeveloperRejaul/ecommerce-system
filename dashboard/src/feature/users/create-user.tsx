
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole } from '@/constant/constant';
import { useAppSelector } from '@/hooks/rtk';
import { adminSectData, moderatorSectData, ownerSelectData, superAdminSelectData } from './constant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createRef, useState } from 'react';


export default function CreateUser() {
    const role = useAppSelector(state => state.user.role);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = createRef<HTMLInputElement>();


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) setFile(event.target.files[0]);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const avatarSrc = file && URL.createObjectURL(file);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Create user</DialogTitle>
                <DialogDescription>
                    Create users if you need. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className='flex justify-center items-center w-full'>
                    <Avatar className='h-[90px] w-[90px] cursor-pointer' onClick={handleAvatarClick}>
                        {avatarSrc && <AvatarImage src={avatarSrc} alt="@shadcn" />}
                        <Input id="picture" type="file" style={{ display: "none", height: "100%", width: "100%" }} ref={fileInputRef} onChange={handleFileChange} accept='image/*' />
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right"> Name </Label>
                    <Input id="name" placeholder='Jon Due' className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right"> Email </Label>
                    <Input id="email" placeholder="demo@example.com" className="col-span-3" />
                </div>
                {/* Select User Role */}
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="role" className="text-right"> Role </Label>
                    <Select>
                        <SelectTrigger className='w-[340px]'>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>User Role</SelectLabel>
                                {role === UserRole.OWNER && ownerSelectData.map((data, index) => <SelectItem key={index} value={data.value}>{data.text}</SelectItem>)}
                                {role === UserRole.SUPER_ADMIN && superAdminSelectData.map((data, index) => <SelectItem key={index} value={data.value}>{data.text}</SelectItem>)}
                                {role === UserRole.ADMIN && adminSectData.map((data, index) => <SelectItem key={index} value={data.value}>{data.text}</SelectItem>)}
                                {role === UserRole.MODERATOR && moderatorSectData.map((data, index) => <SelectItem key={index} value={data.value}>{data.text}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Select Shop name */}
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor="role" className="text-right"> Shop </Label>
                    <Select>
                        <SelectTrigger className='w-[340px]'>
                            <SelectValue placeholder="Select a shop" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <Input type="search" id="search" placeholder="Search..." />
                                <ScrollArea className="h-[200px] rounded-md border-t p-4">
                                    <SelectLabel>Shop Name</SelectLabel>
                                    <SelectItem value="_id">Demo Shop</SelectItem>
                                    <SelectItem value="_id">Demo Shop</SelectItem>
                                    <SelectItem value="_id">Demo Shop</SelectItem>
                                    <SelectItem value="_id">Demo Shop</SelectItem>
                                </ScrollArea>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" className='px-8'>Create</Button>
            </DialogFooter>
        </>
    );
}
