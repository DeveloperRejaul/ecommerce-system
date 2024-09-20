import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useGetAllCategoryQuery } from "../category/api";
import { ICategoryType } from "../category/types";
import { Button } from "@/components/ui/button";
import ColorsPacker from "./color-packer";
import SizesPacker from "./size-packer";
import { useAppSelector } from "@/core/hooks/rtk";
import { useGetShopQuery } from "../shop/api";
import { IShopTypes } from "../shop/types";
import { Label } from "@/components/ui/label";
import ImgPacker from "./img-packer";
import { UserRole } from "@/core/constant/constant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import { useGetAllBrandQuery } from "../brand/api";
import { useCreateProductMutation } from "./api";
import { useGetCouponQuery } from "../coupon/api";

let colors: string[] = [];
let sizes: { [key: string]: number } = {};
let files: File[] = [];

export default function CreateProduct() {
    const category = useGetAllCategoryQuery(undefined);
    const shops = useGetShopQuery(undefined);
    const brand = useGetAllBrandQuery(undefined);
    const coupon = useGetCouponQuery(undefined);
    const [createProduct] = useCreateProductMutation();

    const role = useAppSelector(state => state.user.role);
    const shop = useAppSelector(state => state.user.shopId);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", title: "", description: "", brandId: "", buyPrice: "", category: "", couponId: "", quantity: "", sellPrice: "", shopId: "" },
    });


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const shopId = role === UserRole.OWNER ? data.shopId : shop;
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('buyPrice', data.buyPrice);
        formData.append('quantity', data.quantity);

        formData.append('size', JSON.stringify(sizes));
        formData.append('color', JSON.stringify(colors));

        // all ids 
        formData.append('categoryId', data.category);
        formData.append('brandId', data.brandId);
        if (data?.couponId) formData.append('couponId', data.couponId);
        if (shopId) formData.append('shopId', shopId);

        // image file added 
        files.forEach(file => {
            formData.append('images', file);
        });

        // calculate sell price 
        const buy = +data.buyPrice;
        const sell = +data.sellPrice;
        const percentage = buy * (sell / 100);
        const total = buy + percentage;
        formData.append('sellPrice', total.toString());

        // calling api 
        createProduct(formData);

        // reset form 
        form.reset();
        colors = [];
        sizes = {};
        files = [];
    };

    return (
        <div className="flex flex-1 flex-col px-2 ">
            <h1 className="text-2xl">Create Product</h1>
            <Form {...form}>
                <form className="grid gap-y-4 lg:gap-x-6 lg:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Type product name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder='Type product title' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Type product description...' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {category.data?.map((d: ICategoryType) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Type product quantity' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="buyPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buy Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Type product buy price' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* handle Shop id  */}
                    {role === UserRole.OWNER ? <FormField
                        control={form.control}
                        name="shopId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shop</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shop" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {shops.data?.map((d: IShopTypes) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        :
                        <div />
                    }

                    {/* Coupon Id  */}
                    <FormField
                        control={form.control}
                        name="couponId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coupon (optional)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select CouponId" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {coupon.data?.map((d: IShopTypes) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />


                    {/* Brand select part */}
                    <FormField
                        control={form.control}
                        name="brandId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Brand" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brand.data?.map((d: IShopTypes) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* profit */}
                    <FormField
                        control={form.control}
                        name="sellPrice"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Profit of Percentage </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Percentage" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {new Array(100).fill(0).map((_, i: number) => <SelectItem key={Math.random() * i} value={(i + 1).toString()}>{i + 1}%</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Product Images */}
                    <div className="space-y-2">
                        <Label>Product Images</Label>
                        <ImgPacker onChange={(f) => files = f} />
                    </div>
                    {/* handle color */}
                    <ColorsPacker onChange={(c) => colors = c} />

                    {/* handle size part */}
                    <SizesPacker onChange={(si) => sizes = si} />

                    <Button type="submit">Create Product</Button>

                </form>
            </Form>
        </div>
    );
}


