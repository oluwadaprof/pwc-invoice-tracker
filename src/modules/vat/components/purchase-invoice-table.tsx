import { useState } from "react";
import { formatCurrency } from "../../utils/vat-calculator";
import type { PurchaseInvoice } from "../types/invoice";
import {
    FiscalizationBadge,
    ClaimabilityBadge,
    VatCategoryBadge,
    ReasonCodeLabel,
    IrnDisplay,
} from "./status-badges";
import { Badge } from "@/src/primitives/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/primitives/ui/dialog";
import { ChevronRight, FileText, AlertCircle, QrCode, Info } from "lucide-react";
import { Separator } from "@/src/primitives/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/primitives/ui/table";


type PurchaseInvoiceTableProps = {
    invoices: PurchaseInvoice[];
}

export const PurchaseInvoiceTable = ({ invoices }: PurchaseInvoiceTableProps) => {
    const [selected, setSelected] = useState<PurchaseInvoice | null>(null);

    if (invoices.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No purchase invoices for this period</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="text-xs">Invoice</TableHead>
                            <TableHead className="text-xs">Supplier</TableHead>
                            <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-xs hidden lg:table-cell">IRN</TableHead>
                            <TableHead className="text-xs">Fiscalization</TableHead>
                            <TableHead className="text-xs hidden sm:table-cell">Claimability</TableHead>
                            <TableHead className="text-xs text-right">VAT Paid</TableHead>
                            <TableHead className="text-xs text-right hidden sm:table-cell">Claimable VAT</TableHead>
                            <TableHead className="w-8" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((inv) => {
                            const claimableVat = inv.lineItems.reduce((s, li) => s + li.claimableVatAmount, 0);
                            const excluded = inv.fiscalizationStatus !== "validated";
                            return (
                                <TableRow
                                    key={inv.id}
                                    className={`cursor-pointer hover:bg-muted/30 transition-colors ${excluded ? "opacity-50" : ""}`}
                                    onClick={() => setSelected(inv)}
                                >
                                    <TableCell className="font-mono text-xs font-medium">
                                        {inv.invoiceNumber}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        <div className="max-w-[130px] truncate">{inv.supplierName}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                                        {inv.invoiceDate}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <IrnDisplay irn={inv.irn} />
                                    </TableCell>
                                    <TableCell>
                                        <FiscalizationBadge status={inv.fiscalizationStatus} />
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <ClaimabilityBadge status={inv.overallClaimableStatus} />
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                        {formatCurrency(inv.vatAmount)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs font-medium hidden sm:table-cell">
                                        <span className={excluded ? "text-muted-foreground" : "text-success"}>
                                            {excluded ? "—" : formatCurrency(claimableVat)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                {selected && (
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4" />
                                {selected.invoiceNumber}
                                <FiscalizationBadge status={selected.fiscalizationStatus} />
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            {selected.fiscalizationStatus !== "validated" && (
                                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    This invoice is not NRS-validated. Input VAT from this invoice is excluded from claimable totals.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Supplier</p>
                                    <p className="font-medium">{selected.supplierName}</p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {selected.supplierTIN || "TIN not available"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Invoice Date</p>
                                    <p className="font-medium">{selected.invoiceDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">IRN</p>
                                    <IrnDisplay irn={selected.irn} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Payment</p>
                                    <Badge variant="outline" className="text-xs capitalize">{selected.paymentStatus}</Badge>
                                </div>
                            </div>

                            {selected.irn && (
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                                    <QrCode className="h-4 w-4 shrink-0" />
                                    QR Ref: <span className="font-mono">{selected.qrCodeRef}</span>
                                </div>
                            )}

                            <Separator />

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Line Items & Claimability</h4>
                                <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground mb-3">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    VAT classification and claimability status are determined by the API based on NRS rules. They cannot be edited.
                                </div>
                                <div className="space-y-2">
                                    {selected.lineItems.map((li) => (
                                        <div key={li.id} className="rounded-lg border border-border bg-card p-3">
                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                <p className="text-sm font-medium">{li.description}</p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <VatCategoryBadge category={li.vatCategory} rate={li.vatRate} />
                                                    <ClaimabilityBadge
                                                        status={li.claimableStatus}
                                                        percent={li.claimablePercent}
                                                    />
                                                </div>
                                            </div>
                                            {li.reasonCode && <ReasonCodeLabel code={li.reasonCode} />}
                                            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mt-2">
                                                <div>
                                                    <p>VAT Paid</p>
                                                    <p className="font-mono text-foreground">{formatCurrency(li.vatAmount)}</p>
                                                </div>
                                                <div>
                                                    <p>Claimable VAT</p>
                                                    <p className={`font-mono font-medium ${li.claimableVatAmount > 0 ? "text-success" : "text-muted-foreground"}`}>
                                                        {formatCurrency(li.claimableVatAmount)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>Net Amount</p>
                                                    <p className="font-mono text-foreground">{formatCurrency(li.netAmount)}</p>
                                                </div>
                                            </div>
                                            {li.claimableStatus === "REVIEW_REQUIRED" && (
                                                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Excluded from claimable total — resolve before filing
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Total VAT Paid</span>
                                    <span className="font-mono">{formatCurrency(selected.vatAmount)}</span>
                                </div>
                                <div className="flex justify-between text-success font-medium">
                                    <span>Claimable Input VAT</span>
                                    <span className="font-mono">
                                        {formatCurrency(selected.lineItems.reduce((s, li) => s + li.claimableVatAmount, 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
