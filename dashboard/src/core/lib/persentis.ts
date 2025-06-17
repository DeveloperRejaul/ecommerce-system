export const addPercentage = (price:number, percentage:number) => Math.floor(price + (price * (percentage / 100)));

export const calculateDiscountWithPercentage = (totalPrice:number, discountPercentage:number) => Math.floor(totalPrice * (discountPercentage / 100));

export const getPercentageOfProfit = (buyPrice: number, sellPrice: number) => {
  if (buyPrice === 0) return null;
  if (sellPrice === 0) return null;
  return Math.floor(((sellPrice - buyPrice) / buyPrice) * 100);
};
