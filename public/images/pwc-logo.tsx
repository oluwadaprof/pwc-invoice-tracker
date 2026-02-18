export const PwcLogo = ({ className = "h-8" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 360 180"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="360" height="180" fill="transparent" />
            <text
                x="180"
                y="120"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontWeight="400"
                fontSize="100"
                fill="hsl(var(--foreground))"
            >
                <tspan fill="hsl(var(--primary))">p</tspan>
                <tspan>w</tspan>
                <tspan fill="hsl(var(--primary))">c</tspan>
            </text>
        </svg>
    );
}
