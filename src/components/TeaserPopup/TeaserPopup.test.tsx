import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeaserPopup } from './TeaserPopup';
import { describe, it, expect } from 'vitest';
import { IntlProvider } from 'react-intl';

describe('TeaserPopup', () => {
    it('renders with minimal required props', () => {
        render(
            <IntlProvider
                locale="en"
                messages={{}}
            >
                <TeaserPopup
                    titleText="Title"
                    bodyText="Body"
                />
            </IntlProvider>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
        render(
            <IntlProvider
                locale="en"
                messages={{}}
            >
                <TeaserPopup
                    titleText="Title"
                    bodyText="Body"
                    subtitleText="Subtitle"
                />
            </IntlProvider>
        );
        expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <IntlProvider
                locale="en"
                messages={{}}
            >
                <TeaserPopup
                    titleText="Title"
                    bodyText="Body"
                    closeText="Close"
                    onClose={onClose}
                />
            </IntlProvider>
        );
        await user.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onProceed when proceed button is clicked', async () => {
        const user = userEvent.setup();
        const onProceed = vi.fn();
        render(
            <IntlProvider
                locale="en"
                messages={{}}
            >
                <TeaserPopup
                    titleText="Title"
                    bodyText="Body"
                    proceedText="Proceed"
                    onProceed={onProceed}
                />
            </IntlProvider>
        );
        await user.click(screen.getByText('Proceed'));
        expect(onProceed).toHaveBeenCalledTimes(1);
    });

    it('renders lock icon when dismiss is true', () => {
        render(
            <IntlProvider
                locale="en"
                messages={{ 'adaptation.teaser.lock.alt': 'Lock icon' }}
            >
                <TeaserPopup
                    titleText="Title"
                    bodyText="Body"
                    dismiss={true}
                />
            </IntlProvider>
        );
        expect(screen.getByAltText('Lock icon')).toBeInTheDocument();
    });
});
