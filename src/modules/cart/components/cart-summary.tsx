import { Card, CardContent, CardHeader, CardTitle } from "@/src/primitives/ui/card";


import { Trash2, ShoppingCart } from "lucide-react";


import { useCartStore } from "../../store/cart-store";
import { formatCurrency, calculateCartTotals } from "../../utils/vat-calculator";
import { Button } from "@/src/primitives/ui/button";
import { Separator } from "@/src/primitives/ui/separator";

export const CartSummary = () => {
    const { items, removeItem, clearCart } = useCartStore();
    const totals = calculateCartTotals(items);

    if (items.length === 0) {
        return (
            <Card className="border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">VAT Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center py-6 text-center">
                        <div className="mb-3 rounded-full bg-secondary p-3">
                            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            No items added yet. Select a product to see VAT calculation.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">VAT Calculation</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-foreground">
                    Clear All
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {item.quantity} × {formatCurrency(item.product.basePrice)} ({item.product.vatRate}% VAT)
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <span className="font-medium text-sm whitespace-nowrap">
                                    {formatCurrency(item.product.basePrice * item.quantity)}
                                </span>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeItem(item.product.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-mono">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT Amount</span>
                        <span className="font-mono text-primary">{formatCurrency(totals.vatAmount)}</span>
                    </div>
                    <Separator className="bg-border" />
                    <div className="flex justify-between text-base font-semibold pt-1">
                        <span>Total Amount</span>
                        <span className="font-mono text-primary">{formatCurrency(totals.total)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}