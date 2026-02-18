import { describe, it, expect } from "vitest";

import { CartItem } from "@/src/modules/types/product";
import {  calculateItemVat,
    calculateItemSubtotal,
    calculateItemTotal,
    calculateCartTotals,formatCurrency } from "@/src/modules/utils/vat-calculator";

    
    describe("VAT Calculator", () => {
      describe("calculateItemVat", () => {
        it("calculates VAT correctly for standard rate", () => {
          expect(calculateItemVat(100, 1, 20)).toBe(20);
        });
    
        it("calculates VAT correctly for multiple quantities", () => {
          expect(calculateItemVat(100, 3, 20)).toBe(60);
        });
    
        it("handles zero VAT rate", () => {
          expect(calculateItemVat(100, 1, 0)).toBe(0);
        });
    
        it("handles decimal prices", () => {
          expect(calculateItemVat(99.99, 1, 20)).toBeCloseTo(19.998, 2);
        });
      });
    
      describe("calculateItemSubtotal", () => {
        it("calculates subtotal correctly", () => {
          expect(calculateItemSubtotal(100, 2)).toBe(200);
        });
    
        it("handles single item", () => {
          expect(calculateItemSubtotal(49.99, 1)).toBe(49.99);
        });
      });
    
      describe("calculateItemTotal", () => {
        it("calculates total including VAT", () => {
          expect(calculateItemTotal(100, 1, 20)).toBe(120);
        });
    
        it("calculates total for multiple items", () => {
          expect(calculateItemTotal(50, 2, 20)).toBe(120);
        });
      });
    
      describe("calculateCartTotals", () => {
        it("calculates totals for empty cart", () => {
          const result = calculateCartTotals([]);
          expect(result.subtotal).toBe(0);
          expect(result.vatAmount).toBe(0);
          expect(result.total).toBe(0);
        });
    
        it("calculates totals for single item", () => {
          const items: CartItem[] = [
            {
              product: {
                id: "1",
                name: "Test",
                category: "Services",
                basePrice: 100,
                vatRate: 20,
                description: "Test product",
              },
              quantity: 1,
            },
          ];
          const result = calculateCartTotals(items);
          expect(result.subtotal).toBe(100);
          expect(result.vatAmount).toBe(20);
          expect(result.total).toBe(120);
        });
    
        it("calculates totals for multiple items with different VAT rates", () => {
          const items: CartItem[] = [
            {
              product: {
                id: "1",
                name: "Product A",
                category: "Products",
                basePrice: 100,
                vatRate: 20,
                description: "Product A",
              },
              quantity: 2,
            },
            {
              product: {
                id: "2",
                name: "Product B",
                category: "Services",
                basePrice: 50,
                vatRate: 10,
                description: "Product B",
              },
              quantity: 1,
            },
          ];
          const result = calculateCartTotals(items);
          expect(result.subtotal).toBe(250);
          expect(result.vatAmount).toBe(45);
          expect(result.total).toBe(295);
        });
    
        it("rounds totals to 2 decimal places", () => {
          const items: CartItem[] = [
            {
              product: {
                id: "1",
                name: "Test",
                category: "Services",
                basePrice: 33.33,
                vatRate: 20,
                description: "Test",
              },
              quantity: 1,
            },
          ];
          const result = calculateCartTotals(items);
          expect(result.subtotal).toBe(33.33);
          expect(result.vatAmount).toBe(6.67);
          expect(result.total).toBe(40);
        });
      });
    
      describe("formatCurrency", () => {
        it("formats currency correctly", () => {
          expect(formatCurrency(1234.56)).toBe("₦1,234.56");
        });
      
        it("formats zero correctly", () => {
          expect(formatCurrency(0)).toBe("₦0.00");
        });
      
        it("formats large numbers correctly", () => {
          expect(formatCurrency(1000000)).toBe("₦1,000,000.00");
        });
      });
    });
    
