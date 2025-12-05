import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileUploadStatus } from './FileUploadStatus';
import { FileUploadingStatus } from '../../types';

describe('FileUploadStatus', () => {
    it('renders uploading state', () => {
        render(<FileUploadStatus status={FileUploadingStatus.Uploading} />);
        expect(screen.getByText(/Uploading/i)).toBeInTheDocument();
    });
    it('renders error state', () => {
        render(<FileUploadStatus status={FileUploadingStatus.Error} />);
        expect(screen.getByText(/Error|error/i)).toBeInTheDocument();
    });
    it('renders completed state', () => {
        render(<FileUploadStatus status={FileUploadingStatus.Completed} />);
        expect(screen.getByText(/Upload Complete/i)).toBeInTheDocument();
    });

    it('renders default branch for unknown status value', () => {
        render(
            <FileUploadStatus
                status={'default' as unknown as FileUploadingStatus}
            />
        );
        expect(screen.getByText('default')).toBeInTheDocument();
    });
});
