import { ReactNode } from 'react';
import en from './en.json';
import { useIntl } from 'react-intl';

export type MessageKeys = keyof typeof en;
type PrimitiveTypes = string | number | boolean | null | undefined | Date;
type PrimitiveOptions = Record<string, PrimitiveTypes>;
type RichTextOptions = Record<string, ReactNode | PrimitiveTypes>;

export type FormatOptions = undefined | PrimitiveOptions | RichTextOptions;

// Defines return type based on formatMessage inputs
export type FormatReturn<T> = T extends undefined
    ? string
    : T extends PrimitiveOptions
      ? string
      : T extends RichTextOptions
        ? ReactNode[]
        : never;

export function useFormatMessage() {
    const intl = useIntl();

    return function formatMessage<T extends FormatOptions = undefined>(
        key: MessageKeys,
        options: T = undefined as T
    ): FormatReturn<T> {
        return intl.formatMessage(
            { id: key, defaultMessage: en[key] },
            options
        ) as FormatReturn<T>;
    };
}
