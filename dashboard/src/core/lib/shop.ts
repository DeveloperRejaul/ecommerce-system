import { BASE_URL } from '../constant/constant';

export const createDemoCategory = async (shopId:string) => {
  const categoryDemoData = [
    {
      name: 'Bags',
      avatar: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      type: 'TOP_SELECTION',
      discount: 20,
    },
    {
      name: 'Ear Phone',
      avatar: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      type: 'TOP_SELECTION',
      discount: 25,
    },
    {
      name: 'Watch',
      avatar: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      type: 'TOP_SELECTION',
      discount: 30,
    },
    {
      name: 'Router',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'TOP_SELECTION',
      discount: 50,
    },
    // ROUNDED
    {
      name: 'Mobile',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile2',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile3',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile4',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile5',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile6',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile7',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    {
      name: 'Mobile8',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'ROUNDED',
      discount: 0,
    },
    // SQUARE
    {
      name: 'Routers',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'SQUARE',
      discount: 0,
    },
    {
      name: 'Routers2',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'SQUARE',
      discount: 0,
    },
    {
      name: 'Routers3',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'SQUARE',
      discount: 0,
    },
    // HIDE
    {
      name: 'Trendy',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'HIDE',
      discount: 0,
    },
    {
      name: 'Popular',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73TgAvxuHlmyiJWBXL2L4z3dMMGNKbusWMg&s',
      type: 'HIDE',
      discount: 0,
    },
  ];

  const res = await Promise.all(categoryDemoData.map((category) => fetch(`${BASE_URL}/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...category, shopId }),
    credentials: 'include',
  })));
  return Promise.all(res.map((r) => r.json()));
};

export const createDemoBrand = async (shopId: string) => {
  const brandDemoData = [
    {
      name: 'Samsung',
      avatar: 'https://images.samsung.com/is/image/samsung/assets/us/about-us/brand/logo/mo/360_197_1.png?$720_N_PNG$',
    },
    {
      name: 'Apple',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6RACuKQ8sJxNXI17b6tLyd4vmhraPT5OYmw&s',
    },
  ];

  const res = await Promise.all(brandDemoData.map((b) => fetch(`${BASE_URL}/brand`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...b, shopId }),
    credentials: 'include',
  })));
  return Promise.all(res.map((r) => r.json()));
};

export const createDemoProduct = async ({ categoryId, shopId, brandId }: {categoryId:string, shopId:string, brandId:string }) => {
  const demoData = {
    name: 'Apple 15 pro',
    title: 'Apple 16 Pro: Redefining Performance and Elegance',
    description: "Powerful Performance:Equipped with the latest chipset, the Apple 16 Pro ensures lightning-fast speed, seamless multitasking, and efficiency like never before__Stunning Display:Enjoy vibrant visuals on an ultra-clear display, perfect for gaming, streaming, and creative work.__Advanced Camera System:Capture every moment in incredible detail with professional-grade photography and videography tools.__Long-Lasting Battery:Stay connected all day with optimized power management.__Elegant Design:Crafted with precision, the Apple 16 Pro is not just a device—it's a statement.",
    images: [
      'https://i.ibb.co/dsPv0fTK/photo-1591337676887-a217a6970a8a.jpg',
      'https://i.ibb.co/hRQDBB7f/Apple-i-Phone-15-Yellow-500x500.webp',
      'https://i.ibb.co/dsPv0fTK/photo-1591337676887-a217a6970a8a.jpg',
    ],
    buyPrice: 100,
    sellPrice: 200,
    quantity: 10,
    discount: 20,
    categoryId,
    brandId,
    shopId,
    specification: 'Brand:Apple__Model:16 Pro__Type:Super Retina XDR Display__Size: 6.7 inches__Resolution: 2778 x 1284 pixels__Refresh Rate: 120Hz ProMotion technology__Brightness: Up to 2000 nits peak outdoor brightness',
    keys: 'apple,phone,mobile',
  };
  const data = Array.from({ length: 5 }, () => demoData);

  const res = await Promise.all(data.map((p) => fetch(`${BASE_URL}/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(p),
    credentials: 'include',
  })));
  return Promise.all(res.map((r) => r.json()));
};
