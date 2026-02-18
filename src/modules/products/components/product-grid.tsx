import { EmptyState } from "../../layout/components/empty-state";
import { Product } from "../../types/product"
import { ProductCard } from "./product-card"
import { Loader2 } from "lucide-react"
import { ProductListItem } from "./product-list";
import { Skeleton } from "@/src/primitives/ui/skeleton";

type ProductGridProps = {
    products: Product[];
    selectedProductId: string | null;
    onSelectProduct: (id: string) => void;
    isLoading: boolean;
    view: "grid" | "list";
    searchQuery: string;
}

export const ProductGrid = ({
    products,
    selectedProductId,
    onSelectProduct,
    isLoading,
    view,
    searchQuery,
}: ProductGridProps) => {
    if (isLoading) {
        return view === "grid" ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between mb-2">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return <EmptyState searchQuery={searchQuery} />;
    }

    if (view === "list") {
        return (
            <div className="flex flex-col gap-3">
                {products.map((product) => (
                    <ProductListItem
                        key={product.id}
                        product={product}
                        isSelected={selectedProductId === product.id}
                        onSelect={() => onSelectProduct(product.id)}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProductId === product.id}
                    onSelect={() => onSelectProduct(product.id)}
                />
            ))}
        </div>
    );
}