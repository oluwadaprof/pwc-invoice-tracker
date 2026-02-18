import { ShoppingCart, X, Minus, Plus, Trash2, Calculator } from "lucide-react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue, SelectTrigger
} from "@/src/primitives/ui/select";
import { useToast } from "../../hooks/use-toast";
import { addToCartSchema, type AddToCartFormData } from "../../utils/validation-schema";
import { formatCurrency, calculateCartTotals } from "../../utils/vat-calculator";
import { useCartStore } from "../../store/cart-store";
import { Badge } from "@/src/primitives/ui/badge";
import { Button } from "@/src/primitives/ui/button";
import { Label } from "@/src/primitives/ui/label";
import { Input } from "@/src/primitives/ui/input";
import { Separator } from "@/src/primitives/ui/separator";
import {
    SheetContent, Sheet,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/src/primitives/ui/sheet";
import { Product } from "../../types/product";

type CartSheetProps = {
    products: Product[];
    selectedProductId: string | null;
    onProductSelect: (id: string) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CartSheet = ({
    products,
    selectedProductId,
    onProductSelect,
    open,
    onOpenChange,
}: CartSheetProps) => {
    const { toast } = useToast();
    const { items, addItem, updateQuantity, removeItem, clearCart } = useCartStore();
    const totals = calculateCartTotals(items);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<AddToCartFormData>({
        resolver: zodResolver(addToCartSchema),
        defaultValues: {
            productId: "",
            quantity: 1,
        },
    });

    const watchedProductId = watch("productId");
    const selectedProduct = products.find((p) => p.id === watchedProductId);

    useEffect(() => {
        if (selectedProductId && selectedProductId !== watchedProductId) {
            setValue("productId", selectedProductId, { shouldValidate: true });
        }
    }, [selectedProductId, setValue, watchedProductId]);

    const handleProductChange = (value: string) => {
        setValue("productId", value, { shouldValidate: true });
        onProductSelect(value);
    };

    const onSubmit = (data: AddToCartFormData) => {
        const product = products.find((p) => p.id === data.productId);
        if (product) {
            addItem(product, data.quantity);
            toast({
                title: "Added to calculation",
                description: `${data.quantity}x ${product.name} added`,
            });
            reset({ productId: "", quantity: 1 });
            onProductSelect("");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative h-9 w-9">
                    <Calculator className="h-4 w-4" />
                    {items.length > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {items.length}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        pwc-invoice-tracker
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-hide">
                    <div className="space-y-4 p-4 rounded-lg border border-border bg-secondary/30">
                        <h3 className="text-sm font-medium">Add Product</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="product" className="text-xs">Select Product</Label>
                                <Select value={watchedProductId || ""} onValueChange={handleProductChange}>
                                    <SelectTrigger className="bg-background border-border">
                                        <SelectValue placeholder="Choose a product or service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id}>
                                                <span className="flex items-center gap-2">
                                                    {product.name}
                                                    <span className="text-xs text-muted-foreground">
                                                        ({product.vatRate}% VAT)
                                                    </span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.productId && (
                                    <p className="text-xs text-destructive">{errors.productId.message}</p>
                                )}
                            </div>

                            {selectedProduct && (
                                <div className="text-xs text-muted-foreground p-2 rounded bg-muted/50">
                                    <span className="font-medium">{formatCurrency(selectedProduct.basePrice)}</span>
                                    <span className="mx-1">•</span>
                                    <span className={selectedProduct.vatRate === 0 ? "text-success" : ""}>
                                        {selectedProduct.vatRate === 0
                                            ? (selectedProduct.category === "Exempt" ? "Exempt" : "Zero-Rated")
                                            : `${selectedProduct.vatRate}% VAT`
                                        }
                                    </span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="quantity" className="text-xs">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    max={100}
                                    className="bg-background border-border"
                                    {...register("quantity", { valueAsNumber: true })}
                                />
                                {errors.quantity && (
                                    <p className="text-xs text-destructive">{errors.quantity.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full gap-2" size="sm">
                                <Plus className="h-4 w-4" />
                                Add to Calculation
                            </Button>
                        </form>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Items ({items.length})</h3>
                            {items.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearCart} className="h-7 text-xs text-muted-foreground">
                                    Clear all
                                </Button>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No items added yet</p>
                                <p className="text-xs">Select a product to calculate VAT</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div
                                        key={item.product.id}
                                        className="p-3 rounded-lg border border-border bg-card"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(item.product.basePrice)} × {item.quantity}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 shrink-0 hover:bg-destructive"
                                                onClick={() => removeItem(item.product.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">
                                                    {formatCurrency(item.product.basePrice * item.quantity * (1 + item.product.vatRate / 100))}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    VAT: {formatCurrency(item.product.basePrice * item.quantity * (item.product.vatRate / 100))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(totals.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-primary">
                                <span>Total VAT</span>
                                <span className="font-medium">{formatCurrency(totals.vatAmount)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(totals.total)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
