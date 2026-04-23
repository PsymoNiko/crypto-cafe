"use client"

import * as React from "react"

export type CartItem = {
  id: string
  title: string
  priceTon: number // price in TON (decimal)
  imageUrl?: string
  qty: number
}

type CartState = {
  items: CartItem[]
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  subtotalTon: number
  totalQty: number
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ items: [] })

  const addItem = React.useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.id === item.id)
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + qty } : i
          ),
        }
      }
      return { items: [...prev.items, { ...item, qty }] }
    })
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setState((prev) => ({ items: prev.items.filter((i) => i.id !== id) }))
  }, [])

  const updateQty = React.useCallback((id: string, qty: number) => {
    setState((prev) => ({
      items: prev.items
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0),
    }))
  }, [])

  const clear = React.useCallback(() => setState({ items: [] }), [])

  const subtotalTon = React.useMemo(
    () => state.items.reduce((acc, i) => acc + i.priceTon * i.qty, 0),
    [state.items]
  )
  const totalQty = React.useMemo(
    () => state.items.reduce((acc, i) => acc + i.qty, 0),
    [state.items]
  )

  const value: CartContextValue = {
    items: state.items,
    addItem,
    removeItem,
    updateQty,
    clear,
    subtotalTon,
    totalQty,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
