import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from './api';
import {
  FormControl, FormField, FormItem, FormLabel, Form, FormMessage,
} from '@/components/ui/form';
import { BtnLoading } from '@/components/loading';
import { useAppSelector } from '@/core/hooks/rtk';
import { formSchema } from './loginSchema';
import { path } from '@/core/router/router';

export default function Login() {
  const [handleLogin, response] = useLoginMutation();
  const isLogin = useAppSelector((state) => state.auth.isLogin);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  // handle the login success
  if (isLogin) return <Navigate to={path.ROOT} />;

  return (
    <Form {...form}>
      <div className="flex flex-1 justify-center items-center h-[100vh]">
        <form onSubmit={form.handleSubmit(handleLogin)} className="border p-10 space-y-5">
          <div className="space-y-2">
            <p className="text-4xl font-bold">Login your account</p>
            <p className="text-lg font-medium text-gray-400">Enter your email below to login your account</p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="lg:w-[500px]" placeholder="demo@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="lg:w-[500px]" placeholder="*********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full text-xl text-gray-500 font-medium" type="submit">
            <div>
              {response.isLoading ? <BtnLoading /> : <p>Login</p>}
            </div>
          </Button>
        </form>
      </div>
    </Form>
  );
}
