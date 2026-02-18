import type { SalesInvoice, PurchaseInvoice, VatPeriodSummary } from "../types/invoice";
import { Button } from "@/src/primitives/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/primitives/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

type ExportButtonProps = {
    summary: VatPeriodSummary;
    salesInvoices: SalesInvoice[];
    purchaseInvoices: PurchaseInvoice[];
    periodLabel: string;
}

const toCSV = (rows: string[][]): string => {
    return rows
        .map((row) =>
            row.map((cell) => (cell.includes(",") || cell.includes('"') ? `"${cell.replace(/"/g, '""')}"` : cell)).join(",")
        )
        .join("\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function ExportButton({
    summary,
    salesInvoices,
    purchaseInvoices,
    periodLabel,
}: ExportButtonProps) {
    const claimableTotal = summary.claimableInputVat + summary.partiallyClaimableInputVat;

    function exportVatSummaryCSV() {
        const rows: string[][] = [
            ["VAT SUMMARY REPORT"],
            ["Period", periodLabel],
            ["Generated", new Date().toISOString()],
            [],
            ["METRIC", "AMOUNT (NGN)"],
            ["Output VAT (Sales)", summary.outputVat.toString()],
            ["Claimable Input VAT (Fully)", summary.claimableInputVat.toString()],
            ["Claimable Input VAT (Partial)", summary.partiallyClaimableInputVat.toString()],
            ["Total Claimable Input VAT", claimableTotal.toString()],
            ["Not Claimable Input VAT", summary.notClaimableInputVat.toString()],
            ["Review Required Input VAT", summary.reviewRequiredInputVat.toString()],
            ["VAT PAYABLE", summary.vatPayable.toString()],
            [],
            ["NOTE", "Only NRS-validated invoices are included in calculations"],
            ["Excluded invoices", summary.excludedFromCalculation.toString()],
        ];
        downloadFile(toCSV(rows), `vat-summary-${summary.period}.csv`, "text/csv");
    }

    function exportSalesCSV() {
        const rows: string[][] = [
            ["SALES INVOICES (AR) — " + periodLabel],
            [],
            ["Invoice No", "Customer", "Customer TIN", "Invoice Date", "IRN", "Fiscalization Status", "Payment Status", "Net Amount", "VAT Amount", "Total", "Included in VAT Calc"],
            ...salesInvoices.map((inv) => [
                inv.invoiceNumber,
                inv.customerName,
                inv.customerTIN,
                inv.invoiceDate,
                inv.irn || "N/A",
                inv.fiscalizationStatus,
                inv.paymentStatus,
                inv.netAmount.toFixed(2),
                inv.vatAmount.toFixed(2),
                inv.total.toFixed(2),
                inv.fiscalizationStatus === "validated" ? "Yes" : "No",
            ]),
        ];
        downloadFile(toCSV(rows), `sales-invoices-${summary.period}.csv`, "text/csv");
    }

    function exportPurchasesCSV() {
        const rows: string[][] = [
            ["PURCHASE INVOICES (AP) — " + periodLabel],
            [],
            ["Invoice No", "Supplier", "Supplier TIN", "Invoice Date", "IRN", "Fiscalization Status", "Overall Claimability", "Total VAT Paid", "Claimable VAT", "Excluded from Calc"],
        ];

        purchaseInvoices.forEach((inv) => {
            const claimableVat = inv.lineItems.reduce((s, li) => s + li.claimableVatAmount, 0);
            rows.push([
                inv.invoiceNumber,
                inv.supplierName,
                inv.supplierTIN || "N/A",
                inv.invoiceDate,
                inv.irn || "N/A",
                inv.fiscalizationStatus,
                inv.overallClaimableStatus,
                inv.vatAmount.toFixed(2),
                claimableVat.toFixed(2),
                inv.fiscalizationStatus !== "validated" ? "Yes" : "No",
            ]);

            inv.lineItems.forEach((li) => {
                rows.push([
                    `  → ${li.description}`,
                    "",
                    "",
                    "",
                    "",
                    "",
                    li.claimableStatus,
                    li.vatAmount.toFixed(2),
                    li.claimableVatAmount.toFixed(2),
                    li.reasonCode || "",
                ]);
            });
        });

        downloadFile(toCSV(rows), `purchase-invoices-${summary.period}.csv`, "text/csv");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportVatSummaryCSV} className="gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4" />
                    VAT Summary (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportSalesCSV} className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Sales Invoices (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportPurchasesCSV} className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Purchase Invoices (CSV)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
