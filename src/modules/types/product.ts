export type Product = {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  vatRate: number;
  description: string;
}

export type CartItem = {
  product: Product;
  quantity: number;
}

export type VatCalculation = {
  subtotal: number;
  vatAmount: number;
  total: number;
}
