"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/data/products";

type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productSlug: string, size?: string) => void;
  updateQuantity: (productSlug: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("pixo-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pixo-cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (product: Product, size?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.slug === product.slug && item.size === size
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.slug === product.slug && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { product, quantity: 1, size }];
    });
  };

  const removeFromCart = (productSlug: string, size?: string) => {
    setItems((prevItems) => 
      prevItems.filter((item) => 
        !(item.product.slug === productSlug && (size === undefined || item.size === size))
      )
    );
  };

  const updateQuantity = (productSlug: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productSlug, size);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.slug === productSlug && (size === undefined || item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

