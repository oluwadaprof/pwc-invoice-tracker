import { Button } from "@/src/primitives/ui/button";
import { LayoutGrid, List } from "lucide-react";


type ViewToggleProps = {
    view: "grid" | "list";
    onViewChange: (view: "grid" | "list") => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
    return (
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
            <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onViewChange("grid")}
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onViewChange("list")}
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    );
}