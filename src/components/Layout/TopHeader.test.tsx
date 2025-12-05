import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopHeader } from './TopHeader';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const legalNoticeSpy = vi.fn();
vi.mock('../../context/LegalNoticeProvider', () => ({
    useLegalNotice: () => legalNoticeSpy(),
}));

vi.mock('../../context/AppThemeProvider', () => ({
    useAppThemeName: () => 'light',
}));

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({
        user: {
            name: 'Test User',
            'custom:jupiter-user-id': '123',
            'custom:jupiter-tenant-display-name': 'Test Company',
        },
    }),
}));

vi.mock('../../context/LegalNoticeProvider', () => ({
    useLegalNotice: () => true,
}));

vi.mock('../../context/UserContextProvider', () => ({
    useUserContext: () => ({ canAccessKnowledgeBase: true }),
}));

const reFetchDoc360Token = vi.fn().mockResolvedValue({ data: { token: 'T' } });
vi.mock('../../api/queries/doc360Query', () => ({
    useDoc360TokenQuery: () => ({ reFetchDoc360Token }),
}));

const logoutAndClearSessions = vi.fn();
vi.mock('../../context/SessionProvider', () => ({
    useUserSession: () => ({ logoutAndClearSessions }),
}));

vi.mock('react-router', () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock('../MenuDropDown/MenuDropDown', () => ({
    MenuDropDown: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock('../ThemeSwitcher/ThemeSwitcher', () => ({
    ThemeSwitcher: () => <div>ThemeSwitcher</div>,
}));

const navigateSpy = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => navigateSpy,
}));

const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);

describe('TopHeader', () => {
    beforeEach(() => {
        legalNoticeSpy.mockReset();
        reFetchDoc360Token.mockClear();
        navigateSpy.mockClear();
        logoutAndClearSessions.mockClear();
        windowOpen.mockClear();
    });

    it('renders the top header with user info', () => {
        render(
            <MemoryRouter>
                <TopHeader />
            </MemoryRouter>
        );
        expect(screen.getByTestId('top-header-title')).toHaveTextContent(
            'ClimateScore Global'
        );
        expect(screen.getByTestId('top-header-logo-img')).toHaveAttribute(
            'src',
            '/JupiterLogo_light.svg'
        );
        expect(
            screen.queryByTestId('top-header-knowledge-base-button')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('top-header-welcome-user-text')
        ).toHaveTextContent('Welcome back, Test User');
        expect(screen.getByTestId('top-header-user-company')).toHaveTextContent(
            'Test Company'
        );
    });

    it('renders the knowledge base button enabled', () => {
        render(
            <MemoryRouter>
                <TopHeader />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('top-header-knowledge-base-button')
        ).not.toBeDisabled();
    });

    it('renders actions and handles profile/logout/knowledge base', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <TopHeader />
            </MemoryRouter>
        );

        await user.click(
            screen.getByTestId('top-header-knowledge-base-button')
        );
        expect(reFetchDoc360Token).toHaveBeenCalled();
        expect(windowOpen).toHaveBeenCalled();

        await user.click(
            screen.getByTestId('top-header-menu-drop-down-logout')
        );
        expect(logoutAndClearSessions).toHaveBeenCalled();

        await user.click(
            screen.getByTestId('top-header-menu-drop-down-settings')
        );
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('shows ThemeSwitcher in development mode', async () => {
        vi.resetModules();
        vi.stubEnv('MODE', 'development');
        vi.doMock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => true,
        }));
        vi.doMock('../../context/UserContextProvider', () => ({
            useUserContext: () => ({ canAccessKnowledgeBase: true }),
        }));
        const reFetchDoc360Token = vi
            .fn()
            .mockResolvedValue({ data: { token: 'T' } });
        vi.doMock('../../api/queries/doc360Query', () => ({
            useDoc360TokenQuery: () => ({ reFetchDoc360Token }),
        }));
        const { TopHeader: TH } = await import('./TopHeader');
        render(
            <MemoryRouter>
                <TH />
            </MemoryRouter>
        );
        expect(screen.getByText('ThemeSwitcher')).toBeInTheDocument();
        vi.unstubAllEnvs();
    });

    it('falls back to default placeholders for missing user fields', async () => {
        vi.resetModules();
        vi.doMock('@auth0/auth0-react', () => ({
            useAuth0: () => ({
                user: {},
            }),
        }));
        vi.doMock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => true,
        }));
        const { TopHeader: TH } = await import('./TopHeader');
        render(
            <MemoryRouter>
                <TH />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('top-header-welcome-user-text')
        ).toHaveTextContent('Welcome back, --');
        expect(screen.getByTestId('top-header-user-company')).toHaveTextContent(
            '--'
        );
    });

    it('does not render actions when legal notice not acknowledged', async () => {
        vi.resetModules();
        vi.doMock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => false,
        }));
        const { TopHeader: TH } = await import('./TopHeader');
        render(
            <MemoryRouter>
                <TH />
            </MemoryRouter>
        );
        expect(
            screen.queryByTestId('top-header-knowledge-base-button')
        ).not.toBeInTheDocument();
    });

    it('renders KB button disabled when access is false', async () => {
        vi.resetModules();
        vi.doMock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => true,
        }));
        vi.doMock('../../context/UserContextProvider', () => ({
            useUserContext: () => ({ canAccessKnowledgeBase: false }),
        }));
        const { TopHeader: TH } = await import('./TopHeader');
        render(
            <MemoryRouter>
                <TH />
            </MemoryRouter>
        );
        const kbBtn = screen.getByTestId('top-header-knowledge-base-button');
        expect(kbBtn).toBeDisabled();
    });

    it('does not open KB when token missing', async () => {
        vi.resetModules();
        vi.doMock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => true,
        }));
        vi.doMock('../../context/UserContextProvider', () => ({
            useUserContext: () => ({ canAccessKnowledgeBase: true }),
        }));
        const reFetchDoc360Token = vi.fn().mockResolvedValue({ data: {} });
        vi.doMock('../../api/queries/doc360Query', () => ({
            useDoc360TokenQuery: () => ({ reFetchDoc360Token }),
        }));
        const windowOpen = vi
            .spyOn(window, 'open')
            .mockImplementation(() => null);
        const { TopHeader: TH } = await import('./TopHeader');
        render(
            <MemoryRouter>
                <TH />
            </MemoryRouter>
        );
        const user = userEvent.setup();
        await user.click(
            screen.getByTestId('top-header-knowledge-base-button')
        );
        expect(reFetchDoc360Token).toHaveBeenCalled();
        expect(windowOpen).not.toHaveBeenCalled();
    });

    it('renders dark logo in dark theme', async () => {
        vi.resetModules();
        vi.doMock('../../context/AppThemeProvider', () => ({
            useAppThemeName: () => 'dark',
        }));
        vi.doMock('../../context/LegalNoticeProvider', () => ({
            useLegalNotice: () => true,
        }));
        const { TopHeader: TH } = await import('./TopHeader');
        render(
            <MemoryRouter>
                <TH />
            </MemoryRouter>
        );
        expect(screen.getByTestId('top-header-logo-img')).toHaveAttribute(
            'src',
            '/JupiterLogo_dark.svg'
        );
    });
});
