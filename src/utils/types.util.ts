export function findByValue<Key extends string, Value>(
    value: Value,
    allValues: Record<Key, Value>
): Key | undefined {
    const entries = Object.entries(allValues);
    const element = entries.find(([, currentValue]) => currentValue === value);
    if (element === undefined) {
        return undefined;
    }
    return element[0] as Key;
}
