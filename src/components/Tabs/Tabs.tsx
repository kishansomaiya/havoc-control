import { Tab, Tabs } from '@mui/material';
import { PropsWithChildren, useCallback } from 'react';

const TAB_HEIGHT = 32;
const TAB_RADIUS = '2px';

export type TabValue = string | number;
export type TabOption = { value: TabValue; label: string };

export type TabSelectProps<T extends TabValue> = {
    value?: T;
    onChange?: (val: T) => void;
    options: TabOption[];
};

function getRadius(idx: number, totalLen: number) {
    const radi = ['0', '0', '0', '0'];
    if (idx === 0) {
        radi[0] = TAB_RADIUS;
        radi[3] = TAB_RADIUS;
    }
    if (idx === totalLen - 1) {
        radi[1] = TAB_RADIUS;
        radi[2] = TAB_RADIUS;
    }
    return radi.join(' ');
}

export function TabSelect<T extends TabValue = string>({
    value,
    onChange,
    options,
}: PropsWithChildren<TabSelectProps<T>>) {
    const handleChange = useCallback(
        (_: unknown, val: T) => {
            onChange?.(val);
        },
        [onChange]
    );

    return (
        <Tabs
            value={value}
            onChange={handleChange}
            sx={{
                minHeight: TAB_HEIGHT,
            }}
        >
            {options.map(({ value, label }, idx) => (
                <Tab
                    key={value}
                    sx={{
                        minHeight: TAB_HEIGHT,
                        height: TAB_HEIGHT,
                        border: (theme) =>
                            `1px solid ${theme.palette.grey[500]}`,
                        borderRight: idx === options.length - 1 ? '' : '0',
                        borderRadius: getRadius(idx, options.length),
                        ['&.Mui-selected']: (theme) => ({
                            backgroundColor: theme.palette.grey[600],
                        }),
                    }}
                    value={value}
                    label={label}
                />
            ))}
        </Tabs>
    );
}
