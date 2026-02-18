import { useState } from "react";
import { formatCurrency } from "../../utils/vat-calculator";
import type { SalesInvoice } from "../types/invoice";
import { FiscalizationBadge, VatCategoryBadge, IrnDisplay } from "./status-badges";
import { Badge } from "@/src/primitives/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/primitives/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/primitives/ui/dialog";
import { ChevronRight, QrCode, FileText, AlertCircle } from "lucide-react";
import { Separator } from "@/src/primitives/ui/separator";

type SalesInvoiceTableProps = {
    invoices: SalesInvoice[];
}

export const SalesInvoiceTable = ({ invoices }: SalesInvoiceTableProps) => {
    const [selected, setSelected] = useState<SalesInvoice | null>(null);

    if (invoices.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No sales invoices for this period</p>
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
                            <TableHead className="text-xs">Customer</TableHead>
                            <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-xs hidden lg:table-cell">IRN</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs text-right">Net</TableHead>
                            <TableHead className="text-xs text-right">VAT</TableHead>
                            <TableHead className="text-xs text-right hidden sm:table-cell">Total</TableHead>
                            <TableHead className="w-8" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((inv) => {
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
                                        <div className="max-w-[140px] truncate">{inv.customerName}</div>
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
                                    <TableCell className="text-right font-mono text-xs">
                                        {formatCurrency(inv.netAmount)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs text-primary">
                                        {formatCurrency(inv.vatAmount)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs font-medium hidden sm:table-cell">
                                        {formatCurrency(inv.total)}
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
                                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    This invoice is excluded from VAT calculations — it has not been validated by NRS.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Customer</p>
                                    <p className="font-medium">{selected.customerName}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{selected.customerTIN}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Invoice Date</p>
                                    <p className="font-medium">{selected.invoiceDate}</p>
                                    <p className="text-xs text-muted-foreground">Due: {selected.dueDate}</p>
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
                                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                                <div className="space-y-2">
                                    {selected.lineItems.map((li) => (
                                        <div key={li.id} className="rounded-lg border border-border bg-card p-3">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <p className="text-sm font-medium">{li.description}</p>
                                                <VatCategoryBadge category={li.vatCategory} rate={li.vatRate} />
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                                                <div>
                                                    <p>Qty</p>
                                                    <p className="font-mono text-foreground">{li.quantity}</p>
                                                </div>
                                                <div>
                                                    <p>Unit Price</p>
                                                    <p className="font-mono text-foreground">{formatCurrency(li.unitPrice)}</p>
                                                </div>
                                                <div>
                                                    <p>VAT</p>
                                                    <p className="font-mono text-primary">{formatCurrency(li.vatAmount)}</p>
                                                </div>
                                                <div>
                                                    <p>Total</p>
                                                    <p className="font-mono text-foreground font-medium">{formatCurrency(li.total)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Net Amount</span>
                                    <span className="font-mono">{formatCurrency(selected.netAmount)}</span>
                                </div>
                                <div className="flex justify-between text-primary">
                                    <span>VAT Amount</span>
                                    <span className="font-mono font-medium">{formatCurrency(selected.vatAmount)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-base">
                                    <span>Total</span>
                                    <span className="font-mono">{formatCurrency(selected.total)}</span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
