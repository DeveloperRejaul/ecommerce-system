
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { AvatarFallback, AvatarImage, Avatar } from './ui/avatar';
import { Button } from './ui/button';


export function DrawerCom() {


    return (
        <Drawer direction='right'>
            <DrawerTrigger asChild>
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
            </DrawerTrigger>
            <DrawerContent >
                <div className='h-[100vh] w-[500px]'>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer >
    );
}

