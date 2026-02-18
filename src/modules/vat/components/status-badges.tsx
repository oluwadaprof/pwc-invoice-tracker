import type { FiscalizationStatus, ClaimableStatus, VatCategory, ReasonCode } from "../types/invoice";
import { Badge } from "@/src/primitives/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/primitives/ui/tooltip";
import { CheckCircle2, XCircle, Clock, AlertCircle, ShieldCheck, ShieldOff, Shield } from "lucide-react";

export function FiscalizationBadge({ status }: { status: FiscalizationStatus }) {
    const config = {
        validated: {
            label: "NRS Validated",
            icon: ShieldCheck,
            className: "bg-success/10 text-success border-success/30",
        },
        rejected: {
            label: "NRS Rejected",
            icon: ShieldOff,
            className: "bg-destructive/10 text-destructive border-destructive/30",
        },
        cancelled: {
            label: "Cancelled",
            icon: XCircle,
            className: "bg-muted text-muted-foreground border-border",
        },
        pending: {
            label: "Pending",
            icon: Clock,
            className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        },
    }[status];

    const Icon = config.icon;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium cursor-default ${config.className}`}
                >
                    <Icon className="h-3 w-3" />
                    {config.label}
                </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs max-w-xs">
                {status === "validated" && "This invoice has been validated and signed by the Nigeria Revenue Service (NRS). It is eligible for VAT calculation."}
                {status === "rejected" && "This invoice was rejected by NRS. It cannot be used for VAT calculations."}
                {status === "cancelled" && "This invoice has been cancelled and excluded from VAT calculations."}
                {status === "pending" && "Fiscalization is pending. This invoice is not yet eligible for VAT calculations."}
            </TooltipContent>
        </Tooltip>
    );
}

export function ClaimabilityBadge({
    status,
    percent,
}: {
    status: ClaimableStatus;
    percent?: number;
}) {
    const config = {
        CLAIMABLE: {
            label: "Claimable",
            icon: CheckCircle2,
            className: "bg-success/10 text-success border-success/30",
        },
        PARTIALLY_CLAIMABLE: {
            label: percent ? `${percent}% Claimable` : "Partial",
            icon: AlertCircle,
            className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        },
        NOT_CLAIMABLE: {
            label: "Not Claimable",
            icon: XCircle,
            className: "bg-muted text-muted-foreground border-border",
        },
        REVIEW_REQUIRED: {
            label: "Review Required",
            icon: Clock,
            className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        },
    }[status];

    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${config.className}`}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
}

export function VatCategoryBadge({ category, rate }: { category: VatCategory; rate: number }) {
    const config = {
        standard: {
            label: `Standard (${rate}%)`,
            className: "bg-primary/10 text-primary border-primary/30",
        },
        "zero-rated": {
            label: "Zero-Rated (0%)",
            className: "bg-success/10 text-success border-success/30",
        },
        exempt: {
            label: "Exempt",
            className: "bg-muted text-muted-foreground border-border",
        },
    }[category];

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
}

const REASON_CODE_LABELS: Record<ReasonCode, string> = {
    MISSING_FISCALIZED_INVOICE: "Missing fiscalized invoice",
    EXEMPT_ACTIVITY: "Related to exempt activity",
    SUPPLIER_NOT_REGISTERED: "Supplier not VAT-registered",
    DUPLICATE_IRN: "Duplicate Invoice Reference Number",
    INVOICE_REJECTED_BY_NRS: "Invoice rejected by NRS",
    PARTIAL_BUSINESS_USE: "Partial business use",
    MIXED_USE_ASSET: "Mixed-use asset",
};

export function ReasonCodeLabel({ code }: { code: ReasonCode }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help underline decoration-dotted">
                    <AlertCircle className="h-3 w-3" />
                    {REASON_CODE_LABELS[code]}
                </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs max-w-xs">
                This input VAT cannot be claimed because: {REASON_CODE_LABELS[code].toLowerCase()}. Only NRS-validated invoices for taxable business activities are eligible.
            </TooltipContent>
        </Tooltip>
    );
}

export function IrnDisplay({ irn }: { irn: string }) {
    if (!irn) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <XCircle className="h-3 w-3 text-destructive" />
                No IRN
            </span>
        );
    }
    return (
        <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]" title={irn}>
            {irn}
        </span>
    );
}
