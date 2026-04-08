import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  name: string
  price: number
  qty: number
  image: string
  slug: string
}

interface CartStore {
  cart: CartItem[]
  addToCart: (product: any, qtyCount: number) => void
  removeFromCart: (productId: number) => void
  updateQty: (productId: number, qtyCount: number) => void
  clearCart: () => void
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product, qtyCount) => {
        const currentCart = get().cart
        const existingItem = currentCart.find((item) => item.id === product.id)
        
        if (existingItem) {
          set({
            cart: currentCart.map((item) => 
              item.id === product.id ? { ...item, qty: item.qty + qtyCount } : item
            )
          })
        } else {
          set({
            cart: [...currentCart, { ...product, qty: qtyCount }]
          })
        }
      },
      
      removeFromCart: (productId) => {
        set({
           cart: get().cart.filter((item) => item.id !== productId)
        })
      },
      
      updateQty: (productId, qtyCount) => {
        set({
           cart: get().cart.map((item) => 
             item.id === productId ? { ...item, qty: Math.max(1, qtyCount) } : item
           )
        })
      },
      
      clearCart: () => set({ cart: [] }),
      
      subtotal: () => {
        return get().cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
      }
    }),
    { name: 'kowopefoods-cart-storage' }
  )
)

export const useCartHydration = () => {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => setHydrated(true))
    setHydrated(useCartStore.persist.hasHydrated())
    return () => unsub()
  }, [])

  return hydrated
}

interface UIStore {
  isMenuOpen: boolean
  setMenuOpen: (open: boolean) => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}))
