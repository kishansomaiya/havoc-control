import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfilePage } from './ProfilePage';
import * as userContextModule from '../../context/UserContextProvider';
import * as RoutedTabsModule from '../../components/RoutedTabs/RoutedTabs';
import * as ButtonDropDownModule from '../../components/ButtonDropDown/ButtonDropDown';

vi.spyOn(RoutedTabsModule, 'RoutedTabs').mockImplementation(
    ({ tabs }: RoutedTabsModule.RoutedTabsProps) => (
        <div data-testid="profile-tabs-mock">
            {tabs.map((t) => (
                <div
                    key={t.label}
                    data-testid="profile-tab-item"
                    data-disabled={t.disabled ? 'true' : 'false'}
                >
                    {t.label}
                </div>
            ))}
        </div>
    )
);

vi.spyOn(ButtonDropDownModule, 'ButtonDropDown').mockImplementation(
    (
        props: React.ComponentProps<typeof ButtonDropDownModule.ButtonDropDown>
    ) => (
        <div>
            <button>Contact Support</button>
            <div data-testid="contact-support-menu">{props.children}</div>
        </div>
    )
);

const useUserContextSpy = vi.spyOn(userContextModule, 'useUserContext');

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const renderWithRoute = (initialEntry = '/profile') =>
        render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route
                        path="/profile/*"
                        element={<ProfilePage />}
                    />
                </Routes>
            </MemoryRouter>
        );

    it('shows only User Settings tab when no admin and no portfolio sharer', async () => {
        useUserContextSpy.mockReturnValue({
            isAdministrator: false,
            isPortfolioSharer: false,
        } as ReturnType<typeof userContextModule.useUserContext>);
        renderWithRoute();
        const tabs = screen
            .getAllByTestId('profile-tab-item')
            .map((el) => el.textContent);
        expect(tabs).toEqual(['User Settings']);
        expect(screen.getByText('Contact Support')).toBeInTheDocument();
    });

    it('shows User Settings and Portfolio Sharing when only portfolio sharer', async () => {
        useUserContextSpy.mockReturnValue({
            isAdministrator: false,
            isPortfolioSharer: true,
        } as ReturnType<typeof userContextModule.useUserContext>);
        renderWithRoute();
        const tabs = screen
            .getAllByTestId('profile-tab-item')
            .map((el) => el.textContent);
        expect(tabs).toEqual(['User Settings', 'Portfolio Sharing']);
    });

    it('shows all applicable tabs when admin and sharer', async () => {
        useUserContextSpy.mockReturnValue({
            isAdministrator: true,
            isPortfolioSharer: true,
        } as ReturnType<typeof userContextModule.useUserContext>);
        renderWithRoute();
        const tabs = screen.getAllByTestId('profile-tab-item');
        const labels = tabs.map((el) => el.textContent);
        expect(labels).toEqual([
            'User Settings',
            'Role Management',
            'User Group Management',
            'Portfolio Sharing',
        ]);
        // User Group Management is disabled
        const ugm = tabs.find(
            (el) => el.textContent === 'User Group Management'
        );
        expect(ugm).toHaveAttribute('data-disabled', 'true');
    });

    it('shows Role Management breadcrumb when editing a role', async () => {
        useUserContextSpy.mockReturnValue({
            isAdministrator: true,
            isPortfolioSharer: true,
        } as ReturnType<typeof userContextModule.useUserContext>);
        renderWithRoute('/profile/role-management/edit-role');
        expect(screen.getByTestId('breadcrumbs-locations')).toHaveTextContent(
            'Role Management'
        );
    });

    it('renders contact support menu items', async () => {
        useUserContextSpy.mockReturnValue({
            isAdministrator: true,
            isPortfolioSharer: true,
        } as ReturnType<typeof userContextModule.useUserContext>);
        renderWithRoute();
        // Items should be visible due to mocked ButtonDropDown
        expect(
            screen.getByTestId('contact-support-drop-down-portal')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('contact-support-drop-down-email')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByText('Contact Support'));
        expect(screen.getByTestId('contact-support-menu')).toBeInTheDocument();
    });
});
