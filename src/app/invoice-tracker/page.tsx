"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    fetchReportingPeriods,
    fetchVatSummary,
    fetchSalesInvoices,
    fetchPurchaseInvoices,
} from "@/src/modules/vat/queries/invoices";

import { PeriodSelector } from "@/src/modules/vat/components/period-selector";
import { VatSummaryCards } from "@/src/modules/vat/components/vat-summary-cards";
import { SalesInvoiceTable } from "@/src/modules/vat/components/sales-invoice-table";
import { PurchaseInvoiceTable } from "@/src/modules/vat/components/purchase-invoice-table";
import { ExportButton } from "@/src/modules/vat/components/export-button";
import { AppShell } from "@/src/modules/layout/components/app-shell";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/primitives/ui/tabs";
import { Skeleton } from "@/src/primitives/ui/skeleton";
import { AlertCircle, ReceiptText, ShoppingCart, BarChart3 } from "lucide-react";

export const VatCalculatorPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("Q1-2025");

    const { data: periods = [], isLoading: periodsLoading } = useQuery({
        queryKey: ["reporting-periods"],
        queryFn: fetchReportingPeriods,
    });

    const { data: summary, isLoading: summaryLoading, isError: summaryError } = useQuery({
        queryKey: ["vat-summary", selectedPeriod],
        queryFn: () => fetchVatSummary(selectedPeriod),
        enabled: !!selectedPeriod,
    });

    const { data: salesInvoices = [], isLoading: salesLoading } = useQuery({
        queryKey: ["sales-invoices", selectedPeriod],
        queryFn: () => fetchSalesInvoices(selectedPeriod),
        enabled: !!selectedPeriod,
    });

    const { data: purchaseInvoices = [], isLoading: purchasesLoading } = useQuery({
        queryKey: ["purchase-invoices", selectedPeriod],
        queryFn: () => fetchPurchaseInvoices(selectedPeriod),
        enabled: !!selectedPeriod,
    });

    const selectedPeriodLabel = periods.find((p) => p.value === selectedPeriod)?.label ?? selectedPeriod;

    return (
        <AppShell>
            <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>

                        <p className="text-sm text-muted-foreground mt-0.5">
                            NRS fiscalized invoices only · Read-only interpretation layer
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <PeriodSelector
                            periods={periods}
                            selectedPeriod={selectedPeriod}
                            onPeriodChange={setSelectedPeriod}
                            isLoading={periodsLoading}
                        />
                        {summary && (
                            <ExportButton
                                summary={summary}
                                salesInvoices={salesInvoices}
                                purchaseInvoices={purchaseInvoices}
                                periodLabel={selectedPeriodLabel}
                            />
                        )}
                    </div>
                </div>

                {/* Summary */}
                {summaryLoading ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-28 rounded-xl" />
                            ))}
                        </div>
                        <Skeleton className="h-40 rounded-xl" />
                    </div>
                ) : summaryError ? (
                    <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Failed to load VAT summary. Please try a different period.
                    </div>
                ) : summary ? (
                    <VatSummaryCards summary={summary} />
                ) : null}

                {/* Invoice Tables */}
                <Tabs defaultValue="sales" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="sales" className="gap-2 text-xs sm:text-sm">
                                <ReceiptText className="h-3.5 w-3.5" />
                                Sales (AR)
                                {salesInvoices.length > 0 && (
                                    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                                        {salesInvoices.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="purchases" className="gap-2 text-xs sm:text-sm">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Purchases (AP)
                                {purchaseInvoices.length > 0 && (
                                    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                                        {purchaseInvoices.length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="sales">
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <div>
                                <h2 className="text-sm font-semibold">Accounts Receivable Invoices</h2>
                                <p className="text-xs text-muted-foreground">
                                    Output VAT is calculated only from NRS-validated invoices. Click a row for details.
                                </p>
                            </div>
                            {salesLoading ? (
                                <div className="space-y-2">
                                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
                                </div>
                            ) : (
                                <SalesInvoiceTable invoices={salesInvoices} />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="purchases">
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <div>
                                <h2 className="text-sm font-semibold">Accounts Payable Invoices</h2>
                                <p className="text-xs text-muted-foreground">
                                    Input VAT claimability is determined by the NRS API. Review Required items are excluded from totals. Click a row for details.
                                </p>
                            </div>
                            {purchasesLoading ? (
                                <div className="space-y-2">
                                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
                                </div>
                            ) : (
                                <PurchaseInvoiceTable invoices={purchaseInvoices} />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppShell>
    );
}

export default VatCalculatorPage;

