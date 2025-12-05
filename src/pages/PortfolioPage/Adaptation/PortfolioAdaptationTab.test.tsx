import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioAdaptationTab } from './PortfolioAdaptationTab';
import * as sessionStorageHook from '../../../hooks/useSessionStorage';
import * as featureFlags from '../../../featureFlags/useFeatureFlags';
import * as i18n from '../../../localization/useFormatMessage';
import * as heap from '../../../heap-analytics';
import * as AdaptationVisualizationsModule from './components/AdaptationVisualizations/AdaptationVisualizations';
import * as TeaserPopupModule from '../../../components/TeaserPopup/TeaserPopup';
import { TestRoot } from '../../../testing/TestRoot';

vi.spyOn(featureFlags, 'useFeatureFlags').mockReturnValue({
    adaptationModuleEnabled: false,
    data330Enabled: false,
});

vi.spyOn(i18n, 'useFormatMessage').mockImplementation(
    () =>
        ((key: i18n.MessageKeys) => key) as ReturnType<
            typeof i18n.useFormatMessage
        >
);

vi.spyOn(heap, 'default', 'get').mockReturnValue({
    trackCustomEvent: vi.fn(),
} as unknown as typeof heap.default);

vi.mock('@mui/x-data-grid', async () => {
    const actual =
        await vi.importActual<typeof import('@mui/x-data-grid')>(
            '@mui/x-data-grid'
        );
    return {
        ...actual,
        DataGrid: ({ rows }: { rows?: unknown[] }) => (
            <div
                data-testid="grid"
                data-rows={rows?.length || 0}
            />
        ),
    };
});

const setNotifyMock = vi.fn();
vi.spyOn(sessionStorageHook, 'useSessionStorage').mockReturnValue([
    false,
    setNotifyMock,
] as unknown as ReturnType<typeof sessionStorageHook.useSessionStorage>);

// Mock the visualizations container to surface the elements expected by tests
vi.spyOn(
    AdaptationVisualizationsModule,
    'AdaptationVisualizations'
).mockImplementation(() => (
    <div>
        <div data-testid="adaptation-sidebar" />
        <div data-testid="aal-line" />
        <div data-testid="aal-bar" />
    </div>
));

vi.spyOn(TeaserPopupModule, 'TeaserPopup').mockImplementation(
    (props: TeaserPopupModule.TeaserProps) => (
        <div data-testid="teaser">
            <div data-testid="teaser-title">{props.titleText}</div>
            <div data-testid="teaser-body">{props.bodyText}</div>
            <div data-testid="teaser-subtitle">
                {props.subtitleText ? 'subtitle-present' : ''}
            </div>
            <div data-testid="teaser-disable">
                {props.disableOnProceed ? 'disabled' : 'enabled'}
            </div>
            <button
                data-testid="teaser-close"
                onClick={props.onClose}
            >
                Close
            </button>
            <button
                data-testid="teaser-proceed"
                onClick={props.onProceed}
            >
                Proceed
            </button>
        </div>
    )
);

describe('PortfolioAdaptationTab', () => {
    beforeEach(() => {
        setNotifyMock.mockReset();
    });

    it('renders sidebar and charts', () => {
        render(<PortfolioAdaptationTab />, { wrapper: TestRoot });
        expect(screen.getByTestId('adaptation-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('aal-line')).toBeInTheDocument();
        expect(screen.getByTestId('aal-bar')).toBeInTheDocument();
    });

    it('teaser proceed triggers notify setter', async () => {
        const user = userEvent.setup();
        render(<PortfolioAdaptationTab />, { wrapper: TestRoot });

        // Click proceed
        await user.click(screen.getByTestId('teaser-proceed'));
        expect(setNotifyMock).toHaveBeenCalledWith(true);
    });
});
