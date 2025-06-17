import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ISellData } from '../types';

export default function Sell(props: ISellData) {
  const { count = 0, sells } = props;
  return (
    <div className="border p-4">
      <p className="font-bold text-xl">Recent Sales</p>
      <p className="font-medium text-gray-400 text-lg">
        You made
        {' '}
        {count}
        {' '}
        sales this month.
      </p>
      {/* Recent Sales List */}
      <div>
        {sells.map((data) => (
          <div key={data.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-x-5">
              <Avatar className="w-[50px] h-[50px]">
                <AvatarImage src={data?.user?.avatar} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold">{data.user.name}</p>
                <p className="text-gray-400 text-lg font-medium">{data.user.email}</p>
              </div>
            </div>
            <p className="font-bold text-xl">
              ৳
              {data.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
