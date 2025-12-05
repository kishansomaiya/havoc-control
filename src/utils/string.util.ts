export function trimTrailingSlash(text: string): string {
    return text.replace(/\/$/, '');
}

export function startsWith(
    text: string,
    search: string,
    rawPos: number = 0
): boolean {
    const pos = rawPos > 0 ? rawPos : 0;
    return text.substring(pos, pos + search.length) === search;
}
