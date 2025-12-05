import { PropsWithChildren, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

export type KPICardProps = {
    testId: string;
    leftSymbol?: ReactNode;
    title: string;
};

export function KPICard({
    testId,
    leftSymbol,
    title,
    children,
}: PropsWithChildren<KPICardProps>) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: 'max-content',
            }}
        >
            <Typography
                typography={'body1'}
                color={'#8D9498'}
                data-testid={`${testId}-title`}
            >
                {title}
            </Typography>

            <Typography
                typography={'h1'}
                component={'div'}
            >
                <Box
                    data-testid={`${testId}-content`}
                    sx={{
                        display: 'flex',
                        gap: '4px',
                        width: 'max-content',
                    }}
                >
                    {leftSymbol && (
                        <Box data-testid={`${testId}-left-symbol`}>
                            {leftSymbol}
                        </Box>
                    )}
                    <Box data-testid={`${testId}-children`}>{children}</Box>
                </Box>
            </Typography>
        </Box>
    );
}
