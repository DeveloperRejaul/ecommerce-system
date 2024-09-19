export const calculateProfitParentage = (buyPrice: number, sellPrice: number) => {
    const profit = sellPrice - buyPrice;
    const profitPercentage = (profit / buyPrice) * 100;
    return Math.round(profitPercentage).toString();
};