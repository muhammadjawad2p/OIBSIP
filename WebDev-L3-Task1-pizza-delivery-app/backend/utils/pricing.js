const TAX_RATE = 0.05; // 5%
const DELIVERY_CHARGE = 40; // flat charge, INR
const FREE_DELIVERY_THRESHOLD = 500;

// Simple coupon table — in a real app this would live in DB
const COUPONS = {
  PIZZA10: { type: "percent", value: 10 },
  FLAT50: { type: "flat", value: 50 },
};

const applyCoupon = (subtotal, couponCode) => {
  if (!couponCode) return 0;
  const coupon = COUPONS[couponCode.toUpperCase()];
  if (!coupon) return 0;
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  return coupon.value;
};

const calculateOrderTotals = (items, couponCode) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = applyCoupon(subtotal, couponCode);
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxableAmount * TAX_RATE);
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const grandTotal = taxableAmount + tax + deliveryCharge;

  return { subtotal, discount, tax, deliveryCharge, grandTotal };
};

module.exports = { calculateOrderTotals, applyCoupon, COUPONS, TAX_RATE, DELIVERY_CHARGE };
