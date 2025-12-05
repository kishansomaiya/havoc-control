import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as settingsCtx from '../../context/ComplienceDataSettingsContext';
import { FiltersConfigurationIcon } from './FiltersConfigurationIcon';
import {
    DisclosureCategory,
    EUHazardMetadata,
} from '../../../../../api/openapi/auto-generated';
import { ComponentProps } from 'react';
import * as DataSettingsFormModule from './DataSettingsForm/DataSettingsForm';
import * as ConfirmModalModule from '../../../../../components/ConfirmModal/ConfirmModal';

vi.spyOn(settingsCtx, 'useComplianceCategories').mockReturnValue([
    'acute' as DisclosureCategory,
]);
vi.spyOn(settingsCtx, 'useComplianceEUMetrics').mockReturnValue(['id1']);
vi.spyOn(settingsCtx, 'useUpdateComplianceCategories').mockReturnValue(vi.fn());
vi.spyOn(settingsCtx, 'useUpdateComplianceEUMetrics').mockReturnValue(vi.fn());

vi.spyOn(DataSettingsFormModule, 'DataSettingsForm').mockImplementation(
    (props: ComponentProps<typeof DataSettingsFormModule.DataSettingsForm>) => (
        <div>
            <div data-testid="data-settings-form" />
            <button
                data-testid="toggle-invalid"
                onClick={() => props.onSelectedEUMetricsChange([])}
            />
        </div>
    )
);

vi.spyOn(ConfirmModalModule, 'ConfirmModal').mockImplementation(
    (props: ComponentProps<typeof ConfirmModalModule.ConfirmModal>) => (
        <div data-testid="unsaved-changes-modal">
            <button
                data-testid="confirm"
                onClick={props.onConfirm}
            />
            <button
                data-testid="cancel"
                onClick={props.onCancel}
            />
        </div>
    )
);

describe('FiltersConfigurationIcon', () => {
    const metadata = {
        id1: { category: 'acute' } as unknown as EUHazardMetadata,
    } as Record<string, EUHazardMetadata>;

    it('opens modal and closes without changes via discard', async () => {
        const user = userEvent.setup();
        render(
            <FiltersConfigurationIcon
                resultSetMetadata={metadata}
                currentlyViewedCategory={'all'}
            />
        );
        await user.click(
            screen.getByTestId('open-compliance-configuration-dialog-icon')
        );
        expect(screen.getByTestId('data-settings-modal')).toBeInTheDocument();
        await user.click(screen.getByTestId('data-settings-modal-x-icon'));
        // Unsaved modal appears only when there are changes; mimic change first
        await user.click(
            screen.getByTestId('open-compliance-configuration-dialog-icon')
        );
        expect(screen.getByTestId('data-settings-modal')).toBeInTheDocument();
        // induce change by clicking toggle-invalid which clears metrics
        await user.click(screen.getByTestId('toggle-invalid'));
        await user.click(screen.getByTestId('data-settings-modal-x-icon'));
        expect(screen.getByTestId('unsaved-changes-modal')).toBeInTheDocument();
        await user.click(screen.getByTestId('confirm'));
    });

    it('disables apply when form invalid', async () => {
        const user = userEvent.setup();
        render(
            <FiltersConfigurationIcon
                resultSetMetadata={metadata}
                currentlyViewedCategory={'all'}
            />
        );
        await user.click(
            screen.getByTestId('open-compliance-configuration-dialog-icon')
        );
        expect(
            screen.getByTestId('data-settings-modal-apply-button')
        ).not.toBeDisabled();
        await user.click(screen.getByTestId('toggle-invalid'));
        // Apply should be disabled while modal is still open
        expect(
            screen.getByTestId('data-settings-modal-apply-button')
        ).toBeDisabled();
    });
});
