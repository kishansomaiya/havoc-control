import { ComponentProps, FC } from 'react';
import { CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { useAppTheme } from '../../context/AppThemeProvider';
import { TopHeaderSkeletal } from './TopHeaderSkeletal';

export interface LayoutSkeletalProps extends ComponentProps<'div'> {}

export const LayoutSkeletal: FC<LayoutSkeletalProps> = ({
    children,
    ...props
}) => {
    const theme: Theme = useAppTheme();

    return (
        <div {...props}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <TopHeaderSkeletal />
                {children}
            </ThemeProvider>
        </div>
    );
};
