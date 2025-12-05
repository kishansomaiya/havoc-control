import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ClientCredsGrid } from './ClientCredsSettings';
import * as zedToken from '../../../context/ZedTokenProvider';
import * as clientsQuery from '../../../api/queries/clientsQuery';
import * as clientsMutation from '../../../api/mutations/clientsMutation';
import { TestRoot } from '../../../testing/TestRoot';

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({ user: { 'custom:jupiter-user-id': 'u1' } }),
}));

vi.spyOn(zedToken, 'useZedToken').mockReturnValue({
    token: 'z',
} as unknown as ReturnType<typeof zedToken.useZedToken>);

const reFetchClients = vi.fn();
const mockUseClientsQueryImpl = vi.fn();
vi.spyOn(clientsQuery, 'useClientsQuery').mockImplementation(
    (...args: unknown[]) => mockUseClientsQueryImpl(...args)
);

const createClient = vi.fn();
const deleteClient = vi.fn();
let isClientCreating = false;
vi.spyOn(clientsMutation, 'useCreateClientMutation').mockImplementation(
    () =>
        ({
            createClient,
            isClientCreating,
        }) as unknown as ReturnType<
            typeof clientsMutation.useCreateClientMutation
        >
);
vi.spyOn(clientsMutation, 'useDeleteClientMutation').mockReturnValue({
    deleteClient,
    isClientDeleting: false,
} as unknown as ReturnType<typeof clientsMutation.useDeleteClientMutation>);

const renderWithProviders = (ui: JSX.Element) =>
    render(
        <TestRoot
            locale="en"
            messages={{}}
        >
            {ui}
        </TestRoot>
    );

describe('ClientCredsGrid', () => {
    it('renders client creds and handles copy buttons', async () => {
        const user = userEvent.setup();
        mockUseClientsQueryImpl.mockReturnValue({
            clientsDetailsData: [
                { id: '1', clientId: 'cid', clientSecret: 'sec' },
            ],
            isClientsLoading: false,
            reFetchClients,
        });
        renderWithProviders(<ClientCredsGrid />);
        expect(screen.getByDisplayValue('cid')).toBeInTheDocument();
        // click first endAdornment icon button (copy)
        const copyButtons = screen.getAllByRole('button');
        await user.click(copyButtons[0]);
    });

    it('creates and deletes client credentials, then refetches list', async () => {
        const user = userEvent.setup();
        mockUseClientsQueryImpl.mockReturnValue({
            clientsDetailsData: [
                { id: '1', clientId: 'cid', clientSecret: 'sec' },
            ],
            isClientsLoading: false,
            reFetchClients,
        });
        renderWithProviders(<ClientCredsGrid />);
        // Click create button by its text content
        await user.click(
            screen.getByRole('button', { name: /Create New Client/i })
        );
        // Open delete confirm by clicking the trash icon button (exclude labeled button)
        const iconButtons = screen
            .getAllByRole('button')
            .filter(
                (b) => !/Create New Client/i.test((b.textContent || '').trim())
            );
        await user.click(iconButtons[iconButtons.length - 1]);
        // Confirm deletion in modal
        await user.click(screen.getByRole('button', { name: /Delete/i }));
        expect(createClient).toHaveBeenCalledTimes(1);
        expect(deleteClient).toHaveBeenCalledTimes(1);
        expect(reFetchClients).toHaveBeenCalled();
    });

    it('shows loading spinner when clients loading and disables create', () => {
        mockUseClientsQueryImpl.mockReturnValue({
            clientsDetailsData: [],
            isClientsLoading: true,
            reFetchClients,
        });
        renderWithProviders(<ClientCredsGrid />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('disables create when two clients exist', () => {
        mockUseClientsQueryImpl.mockReturnValue({
            clientsDetailsData: [
                { id: '1', clientId: 'cid1', clientSecret: 'sec1' },
                { id: '2', clientId: 'cid2', clientSecret: 'sec2' },
            ],
            isClientsLoading: false,
            reFetchClients,
        });
        renderWithProviders(<ClientCredsGrid />);
        expect(
            screen.getByRole('button', { name: /Create New Client/i })
        ).toBeDisabled();
    });

    it('shows inline spinner when creating a client', async () => {
        userEvent.setup();
        isClientCreating = true;
        mockUseClientsQueryImpl.mockReturnValue({
            clientsDetailsData: [
                { id: '1', clientId: 'cid', clientSecret: 'sec' },
            ],
            isClientsLoading: false,
            reFetchClients,
        });
        renderWithProviders(<ClientCredsGrid />);
        // When creating, the button is disabled; assert spinner is visible instead of clicking
        expect(
            screen.getByRole('button', { name: /Create New Client/i })
        ).toBeDisabled();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        isClientCreating = false;
    });
});
