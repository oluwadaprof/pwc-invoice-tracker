import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/primitives/ui/select";
import { Skeleton } from "@/src/primitives/ui/skeleton";
import type { ReportingPeriod } from "../types/invoice";
import { CalendarRange } from "lucide-react";

type PeriodSelectorProps = {
    periods: ReportingPeriod[];
    selectedPeriod: string;
    onPeriodChange: (value: string) => void;
    isLoading: boolean;
}

export const PeriodSelector = ({
    periods,
    selectedPeriod,
    onPeriodChange,
    isLoading,
}: PeriodSelectorProps) => {
    if (isLoading) {
        return <Skeleton className="h-10 w-56" />;
    }

    const selected = periods.find((p) => p.value === selectedPeriod);

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarRange className="h-4 w-4" />
                <span className="hidden sm:inline">Reporting Period:</span>
            </div>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                <SelectTrigger className="w-52 bg-card border-border font-medium">
                    <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Quarterly
                    </div>
                    {periods
                        .filter((p) => p.value.startsWith("Q"))
                        .map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                                {period.label}
                            </SelectItem>
                        ))}
                    <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                        Monthly
                    </div>
                    {periods
                        .filter((p) => !p.value.startsWith("Q"))
                        .map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                                {period.label}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
            {selected && (
                <span className="hidden md:inline text-xs text-muted-foreground">
                    {selected.startDate} → {selected.endDate}
                </span>
            )}
        </div>
    );
}
