import { Badge } from "@/src/primitives/ui/badge";


type CategoryFilterProps = {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

export const CategoryFilter = ({
    categories,
    selectedCategory,
    onCategoryChange,
}: CategoryFilterProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => onCategoryChange(null)}
            >
                All
            </Badge>
            {categories.map((category) => (
                <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => onCategoryChange(category)}
                >
                    {category}
                </Badge>
            ))}
        </div>
    );
}