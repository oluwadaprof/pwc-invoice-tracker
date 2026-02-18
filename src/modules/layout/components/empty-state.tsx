import { FileText } from "lucide-react";

type EmptyStateProps = {
    searchQuery: string;
}

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">
                {searchQuery ? "No results found" : "No products yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery
                    ? `No products or services match "${searchQuery}". Try a different search term.`
                    : "Products and services will appear here."}
            </p>
        </div>
    );
}