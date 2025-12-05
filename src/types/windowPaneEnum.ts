import { WindowPane as ApiWindowPane } from '../api/openapi/auto-generated';
import { findByValue } from '../utils/types.util';

export type WindowPane = keyof typeof ApiWindowPane;
export type WindowPaneValue =
    (typeof ApiWindowPane)[keyof typeof ApiWindowPane];

export const WINDOW_PANE_VALUES: (WindowPane | null)[] = [
    'single',
    'multiple',
    null,
];

const WINDOW_PANE_TITLES: { [key in WindowPane]: string } = {
    single: 'Single',
    multiple: 'Multiple',
    none: 'None',
    unknown: 'Unknown',
    unknownDefaultOpenApi: 'unknownDefaultOpenApi',
};

export function windowPaneFromValue(
    windowPaneValue: string
): WindowPane | undefined {
    return findByValue(windowPaneValue, ApiWindowPane);
}

export function windowPaneValue(windowPane: WindowPane): WindowPaneValue {
    return ApiWindowPane[windowPane];
}

export function windowPaneTitle(windowPane: WindowPane | null): string {
    if (windowPane === null) {
        return 'Unknown ';
    }
    return WINDOW_PANE_TITLES[windowPane];
}
