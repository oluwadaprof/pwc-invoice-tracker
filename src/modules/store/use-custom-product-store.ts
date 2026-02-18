import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "../types/product"

type CustomProductsState = {
  customProducts: Product[]
  addCustomProduct: (product: Omit<Product, "id">) => void
  updateCustomProduct: (id: string, product: Omit<Product, "id">) => void
  deleteCustomProduct: (id: string) => void
  getCustomProduct: (id: string) => Product | undefined
}

export const useCustomProductsStore = create<CustomProductsState>()(
  persist(
    (set, get) => ({
      customProducts: [],
      addCustomProduct: (product) => {
        const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newProduct: Product = { ...product, id }
        set((state) => ({
          customProducts: [...state.customProducts, newProduct],
        }))
      },
      updateCustomProduct: (id, product) =>
        set((state) => ({
          customProducts: state.customProducts.map((p) =>
            p.id === id ? { ...product, id } : p
          ),
        })),
      deleteCustomProduct: (id) =>
        set((state) => ({
          customProducts: state.customProducts.filter((p) => p.id !== id),
        })),
      getCustomProduct: (id) => {
        return get().customProducts.find((p) => p.id === id)
      },
    }),
    {
      name: "custom-vat-products",
    }
  )
)