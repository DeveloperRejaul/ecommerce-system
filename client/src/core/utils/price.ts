interface ICardProductPriceCalculate {
    products : {
        sellPrice: number;
        discount:number;
        quantity:number;
    }[]
    coupon?:{
        type:'FIX'|'PERCENT'
        value: number;
    }
}

export default function cardProductPriceCalculate(params :ICardProductPriceCalculate) {
  const deliveryFee = 100;
  const tax = 0;

  const totalPrice = params.products.reduce((a, b) => a + (b.sellPrice + b.discount) * b.quantity, 0);
  const totalItems = params.products.reduce((a, b) => a + b.quantity, 0);
  const totalDiscount = params.products.reduce((a, b) => a + b.discount * b.quantity, 0);
  const totalTax = 0;
  let totalCouponDiscount = 0;

  if (params?.coupon) {
    if (params.coupon.type === 'FIX') {
      totalCouponDiscount = params.coupon.value;
    }
    if (params.coupon.type === 'PERCENT') {
      totalCouponDiscount = (totalPrice * params.coupon.value) / 100;
    }
  }

  return {
    deliveryFee,
    tax,
    totalTax,
    totalCouponDiscount, // if discount is filled ? totalPrice - couponValue : totalPrice * state.coupon.value) / 100
    totalDiscount, // each discount * each quantity
    totalItems, // each quantity
    totalPrice, // each sellPrice + each discount * each quantity
    finalPrice: Math.round(((totalTax + deliveryFee + totalPrice) - totalDiscount) - totalCouponDiscount), // ((tax + deliveryFee + totalPrice) - totalDiscount) - totalCouponDiscount
  };
}
