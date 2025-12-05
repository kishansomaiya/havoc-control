import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileValidateStatus } from './FileValidateStatus';
import { FileValidationRequestStatus } from '../../types';

describe('FileValidateStatus', () => {
    it('renders validating state', () => {
        render(
            <FileValidateStatus
                status={FileValidationRequestStatus.Validating}
            />
        );
        expect(screen.getByText(/Validating/i)).toBeInTheDocument();
    });
    it('renders error state', () => {
        render(
            <FileValidateStatus status={FileValidationRequestStatus.Error} />
        );
        expect(screen.getByText(/Validation Error/i)).toBeInTheDocument();
    });
    it('renders completed state', () => {
        render(
            <FileValidateStatus
                status={FileValidationRequestStatus.Completed}
            />
        );
        expect(screen.getByText(/Validation Successful/i)).toBeInTheDocument();
    });
    it('renders completed with warnings state', () => {
        render(
            <FileValidateStatus
                status={FileValidationRequestStatus.CompletedWithWarnings}
            />
        );
        expect(
            screen.getByText(/Validation Complete with Warnings/i)
        ).toBeInTheDocument();
    });

    it('renders default branch for unknown status value', () => {
        render(
            <FileValidateStatus
                status={'default' as unknown as FileValidationRequestStatus}
            />
        );
        expect(screen.getByText('default')).toBeInTheDocument();
    });
});
