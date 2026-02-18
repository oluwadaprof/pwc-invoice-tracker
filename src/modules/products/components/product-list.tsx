import { Badge } from "@/src/primitives/ui/badge"
import type { Product } from "../../types/product"
import { formatCurrency } from "../../utils/vat-calculator"
import { useCustomProductsStore } from "../../store/use-custom-product-store"
type ProductListItemProps = {
    product: Product;
    isSelected: boolean;
    onSelect: () => void;
}

const getVatBadgeVariant = (vatRate: number, category: string) => {
    if (vatRate === 0) {
        return category === "Exempt" ? "secondary" : "outline"
    }
    return "default"
}

const getVatLabel = (vatRate: number, category: string) => {
    if (vatRate === 0) {
        return category === "Exempt" ? "Exempt" : "Zero-Rated"
    }
    return `${vatRate}% VAT`
}

export const ProductListItem = ({ product, isSelected, onSelect }: ProductListItemProps) => {
    const isCustom = product.id.startsWith("custom-")
    const { deleteCustomProduct } = useCustomProductsStore()

    const handleDelete = () => {
        deleteCustomProduct(product.id)
    }

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg border bg-card cursor-pointer transition-all duration-200 hover:bg-secondary/50 hover:shadow-md ${isSelected ? "ring-2 ring-primary border-primary" : "border-border"
                }`}
            onClick={onSelect}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                        {product.category}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{product.description}</p>
            </div>
            <div className="flex items-center gap-4 ml-4">
                <Badge variant={getVatBadgeVariant(product.vatRate, product.category)} className="text-xs">
                    {getVatLabel(product.vatRate, product.category)}
                </Badge>
                <span className="text-lg font-semibold text-foreground whitespace-nowrap">
                    {formatCurrency(product.basePrice)}
                </span>
            </div>
        </div>
    )
}