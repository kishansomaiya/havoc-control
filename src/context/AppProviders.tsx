import { FC, ReactNode } from 'react';

import { AppThemeProvider } from './AppThemeProvider';
import { ApiProvider } from '../api/helpers/useApiHook';
import { LegalNoticeProvider } from './LegalNoticeProvider';
import { AlertProvider } from './AlertProvider';
import { AnalysisDataNoticeProvider } from './AnalysisDataNoticeProvider';
import { ZedTokenProvider } from './ZedTokenProvider';

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <>
            <AppThemeProvider>
                <LegalNoticeProvider>
                    <AlertProvider>
                        <AnalysisDataNoticeProvider>
                            <ZedTokenProvider>
                                <ApiProvider>
                                        {children}
                                </ApiProvider>
                            </ZedTokenProvider>
                        </AnalysisDataNoticeProvider>
                    </AlertProvider>
                </LegalNoticeProvider>
            </AppThemeProvider>
        </>
    );
};
