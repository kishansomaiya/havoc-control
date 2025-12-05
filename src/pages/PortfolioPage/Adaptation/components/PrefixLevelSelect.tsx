import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
    MessageKeys,
    useFormatMessage,
} from '../../../../localization/useFormatMessage';
import { useCallback } from 'react';
import { designLevels } from '../config';

export type PrefixLevelSelect = {
    selectedLevel: string;
    onLevelChange: (level: string) => void;
    baseMessage?: MessageKeys;
    levels?: string[];
    postfix?: MessageKeys | '';
    disabled?: boolean;
};

export function PrefixLevelSelect({
    selectedLevel,
    onLevelChange,
    baseMessage = 'adaptation.sidebar.design_level',
    levels = designLevels,
    postfix = 'adaptation.sidebar.years',
    disabled,
}: PrefixLevelSelect) {
    const formatMessage = useFormatMessage();

    const handleChange = useCallback(
        (event: SelectChangeEvent) => {
            onLevelChange(event.target.value);
        },
        [onLevelChange]
    );

    return (
        <Select
            value={selectedLevel}
            disabled={disabled}
            onChange={handleChange}
            style={{ width: '100%' }}
        >
            {levels.map((level) => (
                <MenuItem
                    key={level}
                    value={level}
                >
                    {formatMessage(baseMessage)} {level}{' '}
                    {postfix && formatMessage(postfix)}
                </MenuItem>
            ))}
        </Select>
    );
}
