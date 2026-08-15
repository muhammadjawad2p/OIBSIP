import React, { createContext, useContext, useState, useMemo } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

// Each cart item: { id (unique cart line id), pizzaId, name, image, size, unitPrice, quantity, customization }
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");

  const addItem = (item) => {
    setItems((prev) => [...prev, { ...item, cartId: `${Date.now()}-${Math.random()}` }]);
    toast.success(`${item.name} added to cart`);
  };

  const increaseQty = (cartId) => {
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQty = (cartId) => {
    setItems((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (cartId) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        subtotal,
        totalItems,
        couponCode,
        setCouponCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
