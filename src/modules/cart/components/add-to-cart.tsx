import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import {
    SelectValue, Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from "@/src/primitives/ui/select";
import { addToCartSchema, type AddToCartFormData } from "../../utils/validation-schema";
import { useToast } from "../../hooks/use-toast";
import { useCartStore } from "../../store/cart-store";
import type { Product } from "../../types/product";
import { Button } from "@/src/primitives/ui/button";
import { Input } from "@/src/primitives/ui/input";
import { Label } from "@/src/primitives/ui/label";

type AddToCartFormProps = {
    products: Product[];
    selectedProductId: string | null;
    onProductSelect: (id: string) => void;
}

export const AddToCartForm = ({
    products,
    selectedProductId,
    onProductSelect,
}: AddToCartFormProps) => {
    const { toast } = useToast();
    const addItem = useCartStore((state) => state.addItem);

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="product" className="text-sm">Select Product</Label>
                <Select value={watchedProductId || ""} onValueChange={handleProductChange}>
                    <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue placeholder="Choose a product or service" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                                {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.productId && (
                    <p className="text-xs text-destructive">{errors.productId.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm">Quantity</Label>
                <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={100}
                    className="bg-secondary/50 border-border"
                    {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity && (
                    <p className="text-xs text-destructive">{errors.quantity.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add to Calculation
            </Button>
        </form>
    );
}