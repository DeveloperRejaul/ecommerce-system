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
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { addDays, format } from "date-fns";
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/hooks/rtk';
import { UserRole } from '@/constant/constant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetShopQuery } from '../shop/api';
import { IShopTypes } from '../shop/types';
import { CalendarIcon } from 'lucide-react';


export default function CreateCoupon() {
    const [createCoupon, res] = useCreateCouponMutation();
    const shopRes = useGetShopQuery(undefined);
    const role = useAppSelector(state => state.user.role);
    const shop = useAppSelector(state => state.user.shopId);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { type: "FIX" },
    });
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    });

    const type = form.watch("type");

    const handleCreateCoupon = (data: z.infer<typeof formSchema>) => {
        const { name, type, quantity, value } = data;
        const shopId = role === UserRole.OWNER ? data.shopId : shop;
        createCoupon({ time: date, shopId, name, type, quantity: +quantity, value: +value });

        form.reset();
    };

    return <Form {...form}>
        <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
            <DialogDescription>
                Create Coupon. Click Create when you're done.
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
            <Label>Date Time</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            {/* Select coupon type */}
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Shop</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select coupon type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value='PERCENT'>Percent</SelectItem>
                                <SelectItem value='FIX'>Fix</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* Coupon value field */}
            {type === "FIX" && <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Value of coupon</FormLabel>
                        <FormControl>
                            <Input id="value" placeholder='00000' type="number" className="col-span-3"  {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />}
            {type === "PERCENT" && <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Shop</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select percent" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {new Array(100).fill(0).map((_, i) => i + 1).map((d) => <SelectItem key={d} value={d.toString()}>{`${d}%`}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />}
            {
                role === UserRole.OWNER && <FormField
                    control={form.control}
                    name="shopId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shop</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a shop" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <ScrollArea className="h-[200px] rounded-md border-t p-4">
                                        <Input type="search" id="search" placeholder="Search..." />
                                        {shopRes.data?.map((d: IShopTypes, i: number) => <SelectItem key={Math.random() * i} value={d._id}>{d.name}</SelectItem>)}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            }

            <DialogFooter>
                <Button type="submit" className='px-8'>
                    <div>
                        {res.isLoading ? <BtnLoading /> : <p>Create</p>}
                    </div>
                </Button>
            </DialogFooter>
        </form>
    </Form>;
}
