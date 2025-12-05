import { Box } from '@mui/material';
import { KPICard } from '../../../../../components/KPICard/KPICard';

export type Kpi = {
    name: string;
    title: string;
    value: string;
    showSymbol?: boolean;
};
export type KpiViewerProps = {
    testId: string;
    kpis: Kpi[];
};
export function KpiViewer({ testId, kpis }: KpiViewerProps) {
    return (
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            data-testid={testId}
        >
            {kpis.map(({ name, title, value, showSymbol }) => (
                <KPICard
                    key={name}
                    testId={`${testId}-${name}`}
                    title={title}
                    leftSymbol={showSymbol ? '$' : undefined}
                >
                    {value}
                </KPICard>
            ))}
        </Box>
    );
}
