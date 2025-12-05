import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserGroupManagement } from './UserGroupManagement';

describe('UserGroupManagement', () => {
    it('renders title', () => {
        render(<UserGroupManagement />);
        expect(
            screen.getByTestId('user-group-management-page')
        ).toHaveTextContent('User Group Management Page');
    });
});
