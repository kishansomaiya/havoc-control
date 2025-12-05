import type { ReactNode } from 'react';
import { createElement } from 'react';

const escapeRegex = (value: string) =>
    value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export function highlightsMatches(
    str: string | null | undefined,
    find: string | null | undefined,
    color: string
): ReactNode[] {
    if (!str) return [];
    if (!find) return [str];

    const regex = new RegExp(escapeRegex(find), 'gi');
    const result: ReactNode[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(str)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;

        // Add text before the match
        if (lastIndex < start) {
            result.push(str.slice(lastIndex, start));
        }

        // Add the highlighted match using React.createElement
        result.push(
            createElement(
                'span',
                { key: key++, style: { color } },
                str.slice(start, end)
            )
        );

        lastIndex = end;
    }

    // Add any remaining text after the last match
    if (lastIndex < str.length) {
        result.push(str.slice(lastIndex));
    }

    return result;
}
