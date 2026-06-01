'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './products';

export interface CartItem {
  product: Product;
  selectedVolume: number;
  selectedPrice: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedVolume?: number,
    selectedPrice?: number
  ) => void;
  removeFromCart: (productId: string, selectedVolume?: number) => void;
  updateQuantity: (productId: string, quantity: number, selectedVolume?: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((item: any) => ({
            ...item,
            selectedVolume: Number(item.selectedVolume ?? item.product?.volume ?? 50),
            selectedPrice: Number(item.selectedPrice ?? item.product?.price ?? 0),
          }));
          setItems(migrated);
        }
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (
    product: Product,
    quantity: number,
    selectedVolume?: number,
    selectedPrice?: number
  ) => {
    const vol = Number(selectedVolume ?? product.volume);
    const price = Number(selectedPrice ?? product.price);

    setItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.product.id === product.id && item.selectedVolume === vol
      );
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.selectedVolume === vol
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, selectedVolume: vol, selectedPrice: price, quantity }];
    });
  };

  const removeFromCart = (productId: string, selectedVolume?: number) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (selectedVolume === undefined || item.selectedVolume === selectedVolume)
          )
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedVolume?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVolume);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        (selectedVolume === undefined || item.selectedVolume === selectedVolume)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
