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

export function SheetCom() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className='flex flex-row items-center gap-x-5 cursor-pointer' >
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='text-xl'>Jon Deo</p>
                        <p className='text-sm'>Admin</p>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader className='flex flex-col justify-center items-center'>
                    <Avatar className='w-[100px] h-[100px]'>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className='text-2xl'>Jon Deo</p>
                    <p className='text-sm'>Admin</p>
                </SheetHeader>

                <p>Email: demo@gmail.com</p>
                <p>Address: Ukhia Cox's Bazar</p>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
