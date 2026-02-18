export type VatCategory = "standard" | "zero-rated" | "exempt";
export type FiscalizationStatus = "validated" | "rejected" | "cancelled" | "pending";
export type PaymentStatus = "paid" | "unpaid" | "cancelled" | "partial";
export type ClaimableStatus = "CLAIMABLE" | "PARTIALLY_CLAIMABLE" | "NOT_CLAIMABLE" | "REVIEW_REQUIRED";

export type ReasonCode =
  | "MISSING_FISCALIZED_INVOICE"
  | "EXEMPT_ACTIVITY"
  | "SUPPLIER_NOT_REGISTERED"
  | "DUPLICATE_IRN"
  | "INVOICE_REJECTED_BY_NRS"
  | "PARTIAL_BUSINESS_USE"
  | "MIXED_USE_ASSET";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  vatCategory: VatCategory;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export interface SalesInvoice {
  id: string;
  irn: string;
  qrCodeRef: string;
  invoiceNumber: string;
  customerName: string;
  customerTIN: string;
  invoiceDate: string;
  dueDate: string;
  fiscalizationStatus: FiscalizationStatus;
  paymentStatus: PaymentStatus;
  lineItems: InvoiceLineItem[];
  netAmount: number;
  vatAmount: number;
  total: number;
}

export interface PurchaseInvoiceLineItem extends InvoiceLineItem {
  claimableStatus: ClaimableStatus;
  claimablePercent?: number;
  reasonCode?: ReasonCode;
  claimableVatAmount: number;
}

export interface PurchaseInvoice {
  id: string;
  irn: string;
  qrCodeRef: string;
  invoiceNumber: string;
  supplierName: string;
  supplierTIN: string;
  invoiceDate: string;
  fiscalizationStatus: FiscalizationStatus;
  paymentStatus: PaymentStatus;
  lineItems: PurchaseInvoiceLineItem[];
  netAmount: number;
  vatAmount: number;
  total: number;
  overallClaimableStatus: ClaimableStatus;
}

export interface VatPeriodSummary {
  period: string;
  outputVat: number;
  claimableInputVat: number;
  partiallyClaimableInputVat: number;
  notClaimableInputVat: number;
  reviewRequiredInputVat: number;
  totalInputVat: number;
  vatPayable: number;
  salesInvoiceCount: number;
  purchaseInvoiceCount: number;
  fiscalizedSalesCount: number;
  fiscalizedPurchaseCount: number;
  excludedFromCalculation: number;
}

export interface ReportingPeriod {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}
