import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PrefixLevelSelect } from './PrefixLevelSelect';
import { TestRoot } from '../../../../testing/TestRoot';

describe('DesignLevelSelect', () => {
    const renderComponent = (selectedLevel: string, onLevelChange = vi.fn()) =>
        render(
            <TestRoot>
                <PrefixLevelSelect
                    selectedLevel={selectedLevel}
                    onLevelChange={onLevelChange}
                />
            </TestRoot>
        );

    it('renders with correct selected value', () => {
        const onLevelChange = vi.fn();
        renderComponent('100', onLevelChange);

        const select = screen.getByRole('combobox');
        expect(select).toHaveTextContent('100');
    });

    it('renders all available levels as options', async () => {
        const onLevelChange = vi.fn();
        renderComponent('100', onLevelChange);

        const select = screen.getByRole('combobox');
        const user = userEvent.setup();

        await user.click(select);

        expect(
            screen.getByRole('option', { name: /50\w/ })
        ).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /100/ })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /200/ })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /500/ })).toBeInTheDocument();
    });

    it('calls onLevelChange when a new level is selected', async () => {
        const onLevelChange = vi.fn();
        renderComponent('100', onLevelChange);

        const select = screen.getByRole('combobox');
        const user = userEvent.setup();

        await user.click(select);
        await user.click(screen.getByRole('option', { name: /200/ }));

        expect(onLevelChange).toHaveBeenCalledWith('200');
    });

    it('handles callback correctly for different values', async () => {
        const onLevelChange = vi.fn();
        renderComponent('50', onLevelChange);

        const select = screen.getByRole('combobox');
        const user = userEvent.setup();

        await user.click(select);

        // Note: This test was looking for '250' which isn't in the default levels
        // Let's test with an actual available level
        await user.click(screen.getByRole('option', { name: /500/ }));

        expect(onLevelChange).toHaveBeenCalledTimes(1);
        expect(onLevelChange).toHaveBeenCalledWith('500');
    });

    it('displays correct formatted text for each level', async () => {
        renderComponent('100');

        const select = screen.getByRole('combobox');
        const user = userEvent.setup();

        // Open dropdown to see the formatted options
        await user.click(select);

        // Check that the text content includes both parts
        const option100 = screen.getByRole('option', {
            name: /Design Level:.*100.*Years/,
        });
        expect(option100).toBeInTheDocument();
    });

    it('can be disabled', () => {
        render(
            <TestRoot>
                <PrefixLevelSelect
                    selectedLevel="100"
                    onLevelChange={vi.fn()}
                    disabled={true}
                />
            </TestRoot>
        );

        const select = screen.getByRole('combobox');
        expect(select).toHaveAttribute('aria-disabled', 'true');
    });
});
