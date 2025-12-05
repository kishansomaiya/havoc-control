import en from './en.json';
import { createIntl, createIntlCache } from 'react-intl';
import { FormatOptions, FormatReturn, MessageKeys } from './useFormatMessage';

// Create a standalone intl instance for testing
const cache = createIntlCache();
const intl = createIntl(
    {
        locale: 'en',
        messages: en,
    },
    cache
);

// Test-friendly version that doesn't use hooks
export function formatMessageTesting<T extends FormatOptions = undefined>(
    key: MessageKeys,
    options: T = undefined as T
): FormatReturn<T> {
    return intl.formatMessage(
        { id: key, defaultMessage: en[key] },
        options
    ) as FormatReturn<T>;
}
