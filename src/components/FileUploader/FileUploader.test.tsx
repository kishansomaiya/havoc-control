import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FileUploader } from './FileUploader';
import { FileUploadingStatus, FileValidationRequestStatus } from '../../types';

describe('FileUploader', () => {
    it('renders initial upload UI and description', () => {
        render(<FileUploader description="desc" />);
        expect(
            screen.getByTestId('upload-file-input-icon')
        ).toBeInTheDocument();
        expect(screen.getByTestId('upload-file-input-text')).toHaveTextContent(
            'Upload file'
        );
        expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
    });

    it('accepts a valid csv file and calls onFileSelected', async () => {
        const onFileSelected = vi.fn();
        render(<FileUploader onFileSelected={onFileSelected} />);
        const file = new File(['a,b'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByTestId(
            'upload-file-input'
        ) as HTMLInputElement;
        await userEvent.upload(input, file);

        expect(onFileSelected).toHaveBeenCalledWith(file);
        expect(screen.getByTestId('selected-file-info')).toBeInTheDocument();
        expect(screen.getByTestId('selected-file-name')).toHaveTextContent(
            'test.csv'
        );
        expect(screen.getByTestId('file-upload-status')).toBeInTheDocument();
    });

    it('rejects invalid file type and does not select it', async () => {
        const onFileSelected = vi.fn();
        render(<FileUploader onFileSelected={onFileSelected} />);
        const bad = new File(['x'], 'bad.txt', { type: 'text/plain' });
        const input = screen.getByTestId(
            'upload-file-input'
        ) as HTMLInputElement;
        await userEvent.upload(input, bad);

        expect(
            screen.queryByTestId('selected-file-info')
        ).not.toBeInTheDocument();
    });

    it('shows validation status if provided and supports delete/reset', async () => {
        const onFileSelected = vi.fn();
        const onFileDeleted = vi.fn();
        render(
            <FileUploader
                onFileSelected={onFileSelected}
                onFileDeleted={onFileDeleted}
                fileUploadingStatus={FileUploadingStatus.Completed}
                fileValidationRequestStatus={
                    FileValidationRequestStatus.Validating
                }
            />
        );
        const file = new File(['a,b'], 'data.csv', { type: 'text/csv' });
        const input = screen.getByTestId('upload-file-input');
        await userEvent.upload(input, file);
        expect(onFileSelected).toHaveBeenCalledWith(file);

        await userEvent.click(
            screen.getByTestId('upload-csv-form-delete-icon')
        );
        expect(onFileDeleted).toHaveBeenCalled();
    });

    it('invokes onFileSelected(null) when no file is chosen (change event with empty list)', async () => {
        const onFileSelected = vi.fn();
        render(<FileUploader onFileSelected={onFileSelected} />);
        const input = screen.getByTestId(
            'upload-file-input'
        ) as HTMLInputElement;
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(input, 'files', { value: null, writable: false });
        input.dispatchEvent(event);
        expect(
            screen.queryByTestId('selected-file-info')
        ).not.toBeInTheDocument();
    });
});
