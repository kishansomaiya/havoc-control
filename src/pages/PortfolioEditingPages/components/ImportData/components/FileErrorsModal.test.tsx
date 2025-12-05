import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileErrorsModal } from './FileErrorsModal';
import { ComponentProps } from 'react';
import * as ConfirmModalModule from '../../../../../components/ConfirmModal/ConfirmModal';
import { IFileValidationResponse } from '../../../../../types/fileValidationTypes';
import * as utils from '../../../../../utils';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ConfirmModalModule, 'ConfirmModal').mockImplementation(((
        props: ComponentProps<typeof ConfirmModalModule.ConfirmModal>
    ) => (
        <div
            data-testid="confirm"
            data-message={props.message}
        />
    )) as typeof ConfirmModalModule.ConfirmModal);
    vi.spyOn(utils, 'getFileValidationErrors').mockReturnValue([
        { message: 'E1' },
    ] as ReturnType<typeof utils.getFileValidationErrors>);
});

describe('FileErrorsModal', () => {
    it('shows concatenated message from validation errors', () => {
        render(
            <FileErrorsModal
                open
                onModalClose={() => {}}
                fileValidationResult={{} as IFileValidationResponse}
            />
        );
        expect(screen.getByTestId('confirm')).toBeInTheDocument();
    });
});
