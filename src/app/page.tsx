'use client'

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../lib/api/product"
import { Header } from "../modules/layout/components/header"
import { ProductGrid } from "../modules/products/components/product-grid"
import { CategoryFilter } from "../modules/cart/components/cartegory-filter"
import { useCustomProductsStore } from "../modules/store/use-custom-product-store"
import { SearchBar } from "../modules/layout/components/search-bar"
import { ViewToggle } from "../modules/layout/components/view-toggle"
import { CartSheet } from "../modules/cart/components/cart-sheet"
import { AppShell } from "../modules/layout/components/app-shell"


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cartOpen, setCartOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setCartOpen(true);
  };

  const headerRight = (
    <div className="flex items-center gap-2">
      <div className="hidden sm:block">
        <SearchBar value={searchQuery} onChange={setSearchQuery} resultCount={filteredProducts.length} />
      </div>
      <div className="hidden md:block">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      <CartSheet
        products={products}
        selectedProductId={selectedProductId}
        onProductSelect={setSelectedProductId}
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </div>
  );

  return (
    <AppShell headerRight={headerRight}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="sm:hidden mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} resultCount={filteredProducts.length} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <div className="md:hidden">
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
          <ProductGrid
            products={filteredProducts}
            selectedProductId={selectedProductId}
            onSelectProduct={handleProductSelect}
            isLoading={isLoading}
            view={view}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </AppShell>
  );
}

export default Index