import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { EmptyRolesState } from './EmptyRolesState';

describe('EmptyRolesState', () => {
    it('renders message and Add new role button', async () => {
        render(
            <MemoryRouter>
                <EmptyRolesState />
            </MemoryRouter>
        );
        expect(
            screen.getByText('NO ROLES HAVE BEEN CONFIGURED YET!')
        ).toBeInTheDocument();
        expect(screen.getByTestId('add-new-role-button')).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('add-new-role-button'));
    });
});
