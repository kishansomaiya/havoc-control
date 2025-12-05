import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../context/AppThemeProvider', () => ({
    useAppTheme: () => ({
        palette: {
            mode: 'dark',
            primary: { main: '#1976d2', contrastText: '#fff' },
            background: { default: '#121212', paper: '#1d1d1d' },
            text: { primary: '#fff', secondary: '#b0bec5', disabled: '#666' },
            grey: { '400': '#bdbdbd', '500': '#9e9e9e' },
            divider: '#424242',
            common: { black: '#000', white: '#fff' },
            error: {
                main: '#d32f2f',
                light: '#e57373',
                dark: '#b71c1c',
                contrastText: '#fff',
            },
            warning: {
                main: '#ed6c02',
                light: '#ffb74d',
                dark: '#e65100',
                contrastText: '#fff',
            },
            info: {
                main: '#1976d2',
                light: '#64b5f6',
                dark: '#0d47a1',
                contrastText: '#fff',
            },
            success: {
                main: '#2e7d32',
                light: '#81c784',
                dark: '#1b5e20',
                contrastText: '#fff',
            },
        },
        typography: { fontWeightBold: 700 },
    }),
}));

const legalNoticeSpy = vi.fn();
vi.mock('../../context/LegalNoticeProvider', () => ({
    useLegalNotice: () => legalNoticeSpy(),
}));

vi.mock('../../context/LegalNoticeProvider', () => ({
    useLegalNotice: () => true,
}));

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({ user: {} }),
}));

vi.mock('../../utils', () => ({
    canUserAccessCSRDCopilot: () => true,
}));

vi.mock('./TopHeader', () => ({
    TopHeader: () => <div data-testid="top-header" />,
}));

vi.mock('./LegalNoticeModal', () => ({
    LegalNoticeModal: () => <div data-testid="legal-notice" />,
}));

vi.mock('./CSRDChatInterface/CSRDChatInterface', () => ({
    __esModule: true,
    default: () => <div data-testid="csrd-chat" />,
}));

describe('Layout', () => {
    beforeEach(() => {
        legalNoticeSpy.mockReset();
    });

    it('renders LegalNoticeModal when legal notice is not acknowledged', () => {
        vi.mock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => false,
        }));
        render(
            <Layout>
                <div data-testid="content" />
            </Layout>
        );
        expect(screen.getByTestId('top-header')).toBeInTheDocument();
        expect(screen.getByTestId('legal-notice')).toBeInTheDocument();
        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
        expect(screen.queryByTestId('csrd-chat')).not.toBeInTheDocument();
    });
});
