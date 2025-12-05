import { ComponentProps, FC, useMemo } from 'react';
import { CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { useAppTheme } from '../../context/AppThemeProvider';
import { TopHeader } from './TopHeader';
import { useLegalNotice } from '../../context/LegalNoticeProvider';
import { LegalNoticeModal } from './LegalNoticeModal';
import CSRDChatInterface from './CSRDChatInterface/CSRDChatInterface';
import { useAuth0 } from '@auth0/auth0-react';
import { canUserAccessCSRDCopilot } from '../../utils';

export interface LayoutProps extends ComponentProps<'div'> {}

export const Layout: FC<LayoutProps> = ({ children, ...props }) => {
    const theme: Theme = useAppTheme();
    const isLegalNoticeAcknowledged: boolean = useLegalNotice();
    const { user } = useAuth0();

    const showCSRDCopilot = useMemo<boolean>(
        () => canUserAccessCSRDCopilot(user),
        [user]
    );

    return (
        <div {...props}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <TopHeader />
                {!isLegalNoticeAcknowledged && <LegalNoticeModal />}
                {isLegalNoticeAcknowledged && (
                    <>
                        {children}
                        {showCSRDCopilot && <CSRDChatInterface />}
                    </>
                )}
            </ThemeProvider>
        </div>
    );
};
