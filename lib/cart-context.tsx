'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './products';

export interface CartItem {
  product: Product;
  selectedVolume: number;
  selectedPrice: number;
  quantity: number;
  isDecant?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedVolume?: number,
    selectedPrice?: number,
    isDecant?: boolean
  ) => void;
  removeFromCart: (productId: string, selectedVolume?: number, isDecant?: boolean) => void;
  updateQuantity: (productId: string, quantity: number, selectedVolume?: number, isDecant?: boolean) => void;
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
            isDecant: Boolean(item.isDecant),
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
    selectedPrice?: number,
    isDecant?: boolean
  ) => {
    const vol = Number(selectedVolume ?? product.volume);
    const price = Number(selectedPrice ?? product.price);
    const dec = !!isDecant;

    setItems((prevItems) => {
      const existing = prevItems.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedVolume === vol &&
          !!item.isDecant === dec
      );
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id &&
          item.selectedVolume === vol &&
          !!item.isDecant === dec
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, selectedVolume: vol, selectedPrice: price, quantity, isDecant: dec }];
    });
  };

  const removeFromCart = (productId: string, selectedVolume?: number, isDecant?: boolean) => {
    const dec = isDecant !== undefined ? !!isDecant : undefined;
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (selectedVolume === undefined || item.selectedVolume === selectedVolume) &&
            (dec === undefined || !!item.isDecant === dec)
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedVolume?: number,
    isDecant?: boolean
  ) => {
    const dec = isDecant !== undefined ? !!isDecant : undefined;
    if (quantity <= 0) {
      removeFromCart(productId, selectedVolume, isDecant);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        (selectedVolume === undefined || item.selectedVolume === selectedVolume) &&
        (dec === undefined || !!item.isDecant === dec)
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
