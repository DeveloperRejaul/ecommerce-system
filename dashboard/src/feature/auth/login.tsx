import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  return (
    <div className="flex flex-1 justify-center items-center h-[100vh]">
      <div className="border p-10 space-y-5">
        <div className='space-y-2'>
          <p className="text-4xl font-bold">Login your account</p>
          <p className="text-lg font-medium text-gray-400">Enter your email below to login your account</p>
       </div>
        <div>
          <Label className='text-lg'> Email </Label>
          <Input className='lg:w-[500px]' placeholder='demo@gmail.com'/>
        </div>
        <div>
          <Label className='text-lg'> Password </Label>
          <Input className='lg:w-[500px]' placeholder='*********' type='password'/>
        </div>
        <Button className='w-full text-xl text-gray-500 font-medium'> Login </Button>
      </div>
    </div>
  );
}
