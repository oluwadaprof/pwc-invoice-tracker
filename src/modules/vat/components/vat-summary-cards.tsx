import { formatCurrency } from "../../utils/vat-calculator";
import type { VatPeriodSummary } from "../types/invoice";
import {
    ArrowDownRight,
    ArrowUpRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/primitives/ui/tooltip";

type VatSummaryCardsProps = {
    summary: VatPeriodSummary;
}

const StatCard = ({
    label,
    value,
    sublabel,
    icon: Icon,
    iconClass,
    tooltip,
    highlight,
}: {
    label: string;
    value: string;
    sublabel?: string;
    icon: React.ElementType;
    iconClass: string;
    tooltip?: string;
    highlight?: boolean;
}) => {
    return (
        <div
            className={`rounded-xl border p-4 flex flex-col gap-2 ${highlight
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border"
                }`}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    {label}
                    {tooltip && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-3 w-3 cursor-help opacity-60" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
                        </Tooltip>
                    )}
                </span>
                <Icon className={`h-4 w-4 ${iconClass}`} />
            </div>
            <p className={`text-2xl font-bold font-mono tracking-tight ${highlight ? "text-primary" : "text-foreground"}`}>
                {value}
            </p>
            {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
    );
}

export const VatSummaryCards = ({ summary }: VatSummaryCardsProps) => {
    const claimableTotal = summary.claimableInputVat + summary.partiallyClaimableInputVat;
    const vatPayablePositive = summary.vatPayable > 0;

    return (
        <div className="space-y-4">
            {/* Fiscalization notice */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                    Only <strong>NRS-fiscalized</strong> (validated) invoices are included in VAT calculations.{" "}
                    <strong>{summary.excludedFromCalculation}</strong>{" "}
                    {summary.excludedFromCalculation === 1 ? "invoice" : "invoices"} excluded due to rejected or pending fiscalization status.
                </span>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Output VAT"
                    value={formatCurrency(summary.outputVat)}
                    sublabel={`${summary.fiscalizedSalesCount} of ${summary.salesInvoiceCount} sales invoices`}
                    icon={ArrowUpRight}
                    iconClass="text-destructive"
                    tooltip="VAT charged on your sales (AR) invoices. Only from NRS-validated invoices."
                />
                <StatCard
                    label="Claimable Input VAT"
                    value={formatCurrency(claimableTotal)}
                    sublabel={`${summary.fiscalizedPurchaseCount} of ${summary.purchaseInvoiceCount} purchase invoices`}
                    icon={ArrowDownRight}
                    iconClass="text-success"
                    tooltip="VAT you paid to suppliers that can be offset against your Output VAT. Excludes exempt and review-required items."
                />
                <StatCard
                    label="Review Required"
                    value={formatCurrency(summary.reviewRequiredInputVat)}
                    sublabel="Not included in claimable total"
                    icon={Clock}
                    iconClass="text-amber-500"
                    tooltip="Input VAT flagged for review. Not counted in claimable total until resolved."
                />
                <StatCard
                    label="VAT Payable"
                    value={formatCurrency(Math.abs(summary.vatPayable))}
                    sublabel={vatPayablePositive ? "Amount owed to FIRS" : "Credit balance"}
                    icon={vatPayablePositive ? CheckCircle2 : CheckCircle2}
                    iconClass={vatPayablePositive ? "text-primary" : "text-success"}
                    tooltip="Output VAT minus Claimable Input VAT. Positive = owe FIRS; Negative = credit."
                    highlight
                />
            </div>

            {/* Input VAT breakdown */}
            <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    Input VAT Breakdown
                    <span className="text-xs font-normal text-muted-foreground">(from purchase invoices)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        {
                            label: "Fully Claimable",
                            value: summary.claimableInputVat,
                            color: "text-success",
                            bg: "bg-success/10",
                            border: "border-success/20",
                        },
                        {
                            label: "Partially Claimable",
                            value: summary.partiallyClaimableInputVat,
                            color: "text-amber-600 dark:text-amber-400",
                            bg: "bg-amber-500/10",
                            border: "border-amber-500/20",
                        },
                        {
                            label: "Not Claimable",
                            value: summary.notClaimableInputVat,
                            color: "text-muted-foreground",
                            bg: "bg-muted/40",
                            border: "border-border",
                        },
                        {
                            label: "Review Required",
                            value: summary.reviewRequiredInputVat,
                            color: "text-amber-500",
                            bg: "bg-amber-500/10",
                            border: "border-amber-500/20",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`rounded-lg border p-3 ${item.bg} ${item.border}`}
                        >
                            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                            <p className={`text-base font-bold font-mono ${item.color}`}>
                                {formatCurrency(item.value)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Formula */}
                <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-2 text-sm font-mono">
                    <span className="text-muted-foreground">VAT Payable =</span>
                    <span className="text-destructive font-semibold">{formatCurrency(summary.outputVat)}</span>
                    <span className="text-muted-foreground">−</span>
                    <span className="text-success font-semibold">{formatCurrency(claimableTotal)}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className={`font-bold ${vatPayablePositive ? "text-primary" : "text-success"}`}>
                        {formatCurrency(summary.vatPayable)}
                    </span>
                    {!vatPayablePositive && (
                        <span className="text-xs text-muted-foreground">(credit)</span>
                    )}
                </div>
            </div>
        </div>
    );
}
