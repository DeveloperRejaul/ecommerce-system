import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useCreateCouponMutation } from './api';
import { BtnLoading } from '@/components/loading';
import { formSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format, addDays } from "date-fns";

export default function CreateCoupon() {
    const [createCoupon, res] = useCreateCouponMutation();
    const [date, setDate] = useState<Date>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    // name: "", shopId: "", time: 0, type: "", value: 0 

    const handleCreateCoupon = (data: z.infer<typeof formSchema>) => {
        console.log(data);

    };

    return <Form {...form}>
        <DialogHeader>
            <DialogTitle>Create Shop</DialogTitle>
            <DialogDescription>
                Create shops. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreateCoupon)} className="grid gap-4 py-4">

            {/* name part */}
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
            {/* Quantity Field */}
            <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                            <Input id="quantity" placeholder='00000' type="number" className="col-span-3"  {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            {/* Date Time Field */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="flex w-auto flex-col space-y-2 p-2"
                >
                    <Select
                        onValueChange={(value) =>
                            setDate(addDays(new Date(), parseInt(value)))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                        <Calendar mode="single" selected={date} onSelect={setDate} />
                    </div>
                </PopoverContent>
            </Popover>
            <DialogFooter>
                <Button type="submit" className='px-8'>
                    <div>
                        {res.isLoading ? <BtnLoading /> : <p>Login</p>}
                    </div>
                </Button>
            </DialogFooter>
        </form>
    </Form>;
}
