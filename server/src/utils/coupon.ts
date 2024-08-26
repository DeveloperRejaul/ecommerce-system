export const checkCouponDate = (coupon) => {
    const { time, createdAt } = coupon;

    // Convert createdAt to milliseconds
    const creationTimeMs = new Date(createdAt).getTime();

    // Get current time in milliseconds
    const currentTimeMs = Date.now();

    const diff = currentTimeMs - creationTimeMs;
    return diff < time;
};