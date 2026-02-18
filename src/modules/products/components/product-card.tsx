import { Product } from "../../types/product"
import { formatCurrency } from "../../utils/vat-calculator"
import { Badge } from "@/src/primitives/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/primitives/ui/card"
import { useCustomProductsStore } from "../../store/use-custom-product-store"


type ProductCardProps = {
    product: Product
    isSelected: boolean
    onSelect: () => void
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

export const ProductCard = ({ product, isSelected, onSelect }: ProductCardProps) => {
    const isCustom = product.id.startsWith("custom-")
    const { deleteCustomProduct } = useCustomProductsStore()

    const handleDelete = () => {
        deleteCustomProduct(product.id)
    }

    return (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:bg-secondary/50 hover:shadow-lg ${isSelected ? "ring-2 ring-primary border-primary" : "border-border"
                }`}
            onClick={onSelect}
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium leading-tight">{product.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs shrink-0">
                        {product.category}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(product.basePrice)}
                    </span>
                    <Badge variant={getVatBadgeVariant(product.vatRate, product.category)} className="text-xs">
                        {getVatLabel(product.vatRate, product.category)}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}