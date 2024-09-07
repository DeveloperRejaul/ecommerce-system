import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/hooks/rtk';
import { capitalizeEachWord } from '@/lib/utils';
import { BASE_URL } from '@/constant/constant';

export function SheetCom() {
    const { role, email, avatar, name, address } = useAppSelector(state => state.user);


    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className='flex flex-row items-center gap-x-5 cursor-pointer' >
                    <Avatar>
                        <AvatarImage src={`${BASE_URL}/file/${avatar}`} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='text-xl'>{capitalizeEachWord(name)}</p>
                        <p className='text-sm'>{capitalizeEachWord(role)}</p>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader className='flex flex-col justify-center items-center'>
                    <Avatar className='w-[100px] h-[100px]'>
                        <AvatarImage src={`${BASE_URL}/file/${avatar}`} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className='text-2xl'>{capitalizeEachWord(name)}</p>
                    <p className='text-sm'>{capitalizeEachWord(role)}</p>
                </SheetHeader>

                <p>Email: {email}</p>
                <p>Address: {address}</p>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
