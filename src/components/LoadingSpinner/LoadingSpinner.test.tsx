import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingSpinnerProps } from './LoadingSpinner';

const renderComponent = (props: LoadingSpinnerProps) =>
    render(<LoadingSpinner {...props} />);

const testId = 'test-loading-spinnger';

describe('LoadingSpinner', () => {
    it('should render when loading', () => {
        renderComponent({ loading: true, testId });

        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
    it('should not render when loading is false', () => {
        renderComponent({ loading: false, testId });

        expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
    });
});
