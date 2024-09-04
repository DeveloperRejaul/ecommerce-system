import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Sell() {
    return (
        <div className="border p-4">
            <p className="font-bold text-xl">Recent Sales</p>
            <p className="font-medium text-gray-400 text-lg">You made 265 sales this month.</p>
            {/*Recent Sales List */}
            <div >
                {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className='flex items-center justify-between py-4'>
                        <div className='flex items-center gap-x-5'>
                            <Avatar className='w-[50px] h-[50px]'>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='text-lg font-bold'>Jon Deo</p>
                                <p className='text-gray-400 text-lg font-medium'>demo@gmail.com</p>
                            </div>
                        </div>
                        <p className='font-bold text-xl'>+$1,999.00</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
