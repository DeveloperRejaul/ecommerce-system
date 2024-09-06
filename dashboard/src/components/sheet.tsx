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

export function SheetCom() {
    const role = useAppSelector(state => state.user.role);
    const name = useAppSelector(state => state.user.name);
    const email = useAppSelector(state => state.user.email);
    const address = useAppSelector(state => state.user.address);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className='flex flex-row items-center gap-x-5 cursor-pointer' >
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
