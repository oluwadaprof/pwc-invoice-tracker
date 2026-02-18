import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/src/primitives/ui/input";
import { Button } from "@/src/primitives/ui/button";


type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    resultCount: number;
}

export const SearchBar = ({ value, onChange, resultCount }: SearchBarProps) => {
    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search products & services..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-16 bg-secondary/50 border-border"
            />
            {value && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {resultCount}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChange("")}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
}