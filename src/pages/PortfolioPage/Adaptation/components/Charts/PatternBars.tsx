interface SvgPatternsProps {
    colors: {
        flood: string;
        wind: string;
        wildfire: string;
        heat: string;
    };
}

const PatternColor = '#77DB86';
export function SvgPatterns({ colors }: SvgPatternsProps) {
    return (
        <svg
            width="0"
            height="0"
            style={{ position: 'absolute' }}
        >
            <defs>
                {Object.entries(colors).map(([key, value]) => (
                    <pattern
                        key={key}
                        id={`pattern-${key}`}
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="8"
                            height="8"
                            fill={value}
                        />
                        <rect
                            x="4"
                            y="0"
                            width="2"
                            height="2"
                            fill={PatternColor}
                        />
                        <rect
                            x="0"
                            y="4"
                            width="2"
                            height="2"
                            fill={PatternColor}
                        />
                    </pattern>
                ))}
            </defs>
        </svg>
    );
}
