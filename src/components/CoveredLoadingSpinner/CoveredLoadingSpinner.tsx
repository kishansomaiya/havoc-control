import { Box, Typography } from '@mui/material';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { PropsWithChildren } from 'react';

export type PageLoadingSpinnerProps = {
    isLoading: boolean;
    testId: string;
    text?: string;
    zIndex?: number;
};
export function CoveredLoadingSpinner({
    isLoading,
    text,
    children,
    testId,
    zIndex = 1,
}: PropsWithChildren<PageLoadingSpinnerProps>) {
    return (
        <Box
            position={'relative'}
            width={'100%'}
            height={'100%'}
        >
            {isLoading ? (
                <Box
                    data-testid={`${testId}-cover`}
                    position={'absolute'}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    gap={'8px'}
                    zIndex={zIndex}
                    sx={{
                        backgroundColor: 'rgba(36,36,36, 0.65)',
                    }}
                >
                    <LoadingSpinner
                        minSize
                        loading
                        testId={testId}
                    />
                    {text ? (
                        <Typography typography={'body1'}>{text}</Typography>
                    ) : null}
                </Box>
            ) : null}
            {children}
        </Box>
    );
}
