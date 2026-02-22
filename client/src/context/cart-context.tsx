"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

interface CartItem {
  foodId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (foodId: string) => void
  updateQuantity: (foodId: string, quantity: number) => void
  clearCart: () => void
  totalAmount: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.foodId === newItem.foodId)
      if (existingItem) {
        toast.success("Item quantity updated")
        return prevItems.map((item) =>
          item.foodId === newItem.foodId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      toast.success("Added to cart")
      return [...prevItems, newItem]
    })
  }

  const removeFromCart = (foodId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.foodId !== foodId))
    toast.info("Item removed from cart")
  }

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.foodId === foodId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.info("Cart cleared")
  }

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
