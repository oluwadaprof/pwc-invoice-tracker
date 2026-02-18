import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { BarChart3, ShoppingBag, Wifi } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeSwitcher } from "@/src/primitives/theme-switcher";
import { AddCustomProductDialog } from "../../products/components/add-custom-product-dialog";

const NAV_ITEMS = [
    { href: "/", label: "Product Catalogue", icon: ShoppingBag },
    { href: "/invoice-tracker", label: "Invoice Tracker", icon: BarChart3 },
];

type AppShellProps = {
    children: React.ReactNode;
    headerRight?: React.ReactNode;
    categories?: string[];
}
export const AppShell = ({ children, headerRight, categories }: AppShellProps) => {
    const { theme } = useTheme()
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="container mx-auto px-4 py-3 max-w-7xl">
                    <div className="flex flex-wrap items-center gap-4">
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
                                <p className="text-sm md:text-base font-semibold text-foreground">Invoice Tracker</p>
                                <p className="text-xs text-muted-foreground">NRS e-Invoice Platform</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-1 ml-2">
                            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                        pathname === href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                            {categories && categories.length > 0 && (
                                <AddCustomProductDialog categories={categories} />
                            )}
                            {headerRight}
                            <ThemeSwitcher />
                        </div>
                    </div>

                    <div className="md:hidden flex gap-1 mt-2 pt-2 border-t border-border/50">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-1 justify-center",
                                    pathname === href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>
            {children}
        </div>
    );
}
