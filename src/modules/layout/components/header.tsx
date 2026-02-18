import { Product } from "../../types/product"
import { SearchBar } from "./search-bar"
import { ViewToggle } from "./view-toggle"
import { CartSheet } from "../../cart/components/cart-sheet"
import { ThemeSwitcher } from "@/src/primitives/theme-switcher"
import Image from "next/image"
import { useTheme } from "next-themes"
import { AddCustomProductDialog } from "../../products/components/add-custom-product-dialog"


interface HeaderProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    resultCount: number
    view: "grid" | "list"
    onViewChange: (view: "grid" | "list") => void
    products: Product[]
    selectedProductId: string | null
    onProductSelect: (id: string) => void
    cartOpen: boolean
    onCartOpenChange: (open: boolean) => void
    categories: string[]
}

export const Header = ({
    searchQuery,
    onSearchChange,
    resultCount,
    view,
    onViewChange,
    products,
    selectedProductId,
    onProductSelect,
    cartOpen,
    onCartOpenChange,
    categories,
}: HeaderProps) => {
    const { theme } = useTheme()

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        {theme === "light" ? (
                            <Image
                                alt="PwC logo"
                                src="/images/pwc-logo-black.png"
                                width={50}
                                height={10}
                                priority
                            />
                        ) : (
                            <Image
                                alt="PwC logo"
                                src="/images/pwc-logo-white-.png"
                                width={65}
                                height={15}
                                priority
                            />
                        )}

                        <div className="hidden sm:block h-6 w-px bg-border" />
                        <div className="hidden sm:block">
                            <h1 className="text-sm md:text-base font-semibold text-foreground">pwc-invoice-tracker</h1>
                            <p className="text-xs text-muted-foreground">Nigeria Tax System</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                        <div className="hidden sm:block flex-1 max-w-sm">
                            <SearchBar
                                value={searchQuery}
                                onChange={onSearchChange}
                                resultCount={resultCount}
                            />
                        </div>
                        <div className="hidden md:block">
                            <ViewToggle view={view} onViewChange={onViewChange} />
                        </div>
                        <AddCustomProductDialog categories={categories} />
                        <ThemeSwitcher />
                        <CartSheet
                            products={products}
                            selectedProductId={selectedProductId}
                            onProductSelect={onProductSelect}
                            open={cartOpen}
                            onOpenChange={onCartOpenChange}
                        />
                    </div>
                </div>

                <div className="sm:hidden mt-3">
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        resultCount={resultCount}
                    />
                </div>
            </div>
        </header>
    )
}