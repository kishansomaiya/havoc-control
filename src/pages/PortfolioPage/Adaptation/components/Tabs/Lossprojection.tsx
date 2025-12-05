import { Box, Typography } from '@mui/material';
import { AalLineChart } from '../Charts/AalLineChart';
import { AalBarChart } from '../Charts/AalBarChart';
import {
    MessageKeys,
    useFormatMessage,
} from '../../../../../localization/useFormatMessage';
import { DataLabel } from '../DataTypography/DataLabel';
import { DataValue } from '../DataTypography/DataValue';
import { useMemo } from 'react';
import { abbreviateNumber } from '../../../../../utils';

export type ProjectionCategories =
    | 'all'
    | 'flooding'
    | 'wind'
    | 'fire'
    | 'heat';

export type LossProjectionProps = {
    years: number[];
    adaptedLosses: Record<ProjectionCategories, number[]>;
    unadaptedLosses: Record<ProjectionCategories, number[]>;
};
export function LossProjectionsTab({
    years,
    adaptedLosses,
    unadaptedLosses,
}: LossProjectionProps) {
    const formatMessage = useFormatMessage();

    const kpis = useMemo<
        { key: string; label: MessageKeys; 2025: number; 2055: number }[]
    >(() => {
        const idx2025 = years.findIndex((v) => v === 2025);
        const idx2055 = years.findIndex((v) => v === 2055);

        const adaptedAAL = { 2025: 0, 2055: 0 };
        const unadaptedAAL = { 2025: 0, 2055: 0 };
        const avoidedAAL = { 2025: 0, 2055: 0 };

        if (idx2025 !== -1) {
            adaptedAAL['2025'] = adaptedLosses?.all?.[idx2025] ?? 0;
            unadaptedAAL['2025'] = unadaptedLosses?.all?.[idx2025] ?? 0;
            avoidedAAL['2025'] = unadaptedAAL['2025'] - adaptedAAL['2025'];
        }
        if (idx2055 !== -1) {
            adaptedAAL['2055'] = adaptedLosses?.all?.[idx2055] ?? 0;
            unadaptedAAL['2055'] = unadaptedLosses?.all?.[idx2055] ?? 0;
            avoidedAAL['2055'] = unadaptedAAL['2055'] - adaptedAAL['2055'];
        }

        return [
            {
                key: 'adapted-aal',
                label: 'adaptation.tabs.loss_projection.adaptedAAL',
                ...adaptedAAL,
            },
            {
                key: 'unadapted-aal',
                label: 'adaptation.tabs.loss_projection.unadaptedAAL',
                ...unadaptedAAL,
            },
            {
                key: 'avoided-aal',
                label: 'adaptation.tabs.loss_projection.avoidedAAL',
                ...avoidedAAL,
            },
        ];
    }, [years, adaptedLosses, unadaptedLosses]);
    return (
        <Box>
            <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                gap={'10%'}
                padding={'0 32px'}
                data-testid="loss-projection-tab-data-container"
            >
                <Box
                    display={'flex'}
                    gap={'100px'}
                    alignItems={'center'}
                >
                    {kpis.map((item) => {
                        return (
                            <Box
                                key={item.key}
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                gap={1}
                                flex={1}
                            >
                                <DataLabel
                                    text={formatMessage(
                                        item.label as MessageKeys
                                    )}
                                    testId={`loss-projection-label-${item.key}`}
                                >
                                    <DataValue
                                        testId={`loss-projection-value-2025-${item.key}`}
                                    >
                                        <Typography
                                            typography={'body1'}
                                            component={'span'}
                                            color={'#8D9498'}
                                        >
                                            2025{' '}
                                        </Typography>
                                        ${abbreviateNumber(item['2025'])}
                                    </DataValue>
                                    <DataValue
                                        testId={`loss-projection-value-2055-${item.key}`}
                                    >
                                        <Typography
                                            typography={'body1'}
                                            component={'span'}
                                            color={'#8D9498'}
                                        >
                                            2055{' '}
                                        </Typography>
                                        ${abbreviateNumber(item['2055'])}
                                    </DataValue>
                                </DataLabel>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'36px'}
                padding={'24px'}
            >
                <Box data-testid="aal-line-chart">
                    <AalLineChart
                        years={years}
                        adaptedLosses={adaptedLosses}
                        unadaptedLosses={unadaptedLosses}
                    />
                </Box>
                <Box data-testid="aal-bar-chart">
                    <AalBarChart
                        years={years}
                        adaptedLosses={adaptedLosses}
                        unadaptedLosses={unadaptedLosses}
                    />
                </Box>
            </Box>
        </Box>
    );
}
