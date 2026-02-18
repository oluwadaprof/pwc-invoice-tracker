import type { CartItem, VatCalculation } from "../types/product";


export const calculateItemVat = (basePrice: number, quantity: number, vatRate: number): number => {
  return basePrice * quantity * (vatRate / 100);
}

export const calculateItemSubtotal = (basePrice: number, quantity: number): number => {
  return basePrice * quantity;
}

export const  calculateItemTotal = (basePrice: number, quantity: number, vatRate: number): number => {
  const subtotal = calculateItemSubtotal(basePrice, quantity);
  const vat = calculateItemVat(basePrice, quantity, vatRate);
  return subtotal + vat;
}

export const  calculateCartTotals = (items: CartItem[]): VatCalculation => {
  let subtotal = 0;
  let vatAmount = 0;

  items.forEach((item) => {
    subtotal += calculateItemSubtotal(item.product.basePrice, item.quantity);
    vatAmount += calculateItemVat(item.product.basePrice, item.quantity, item.product.vatRate);
  });

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: Math.round((subtotal + vatAmount) * 100) / 100,
  };
}

export const formatCurrency = (
  amount: number, 
  locale: string = "en-NG", 
  currency: string = "NGN"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

