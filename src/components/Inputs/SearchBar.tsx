import { OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, X as XIcon } from 'react-feather';
import { ChangeEvent, useCallback } from 'react';
import { useFormatMessage } from '../../localization/useFormatMessage';

export type SearchBarProps = {
    onClearIconClick?: () => void;
    placeholder?: string;
    testId: string;
    value?: string;
    onChange?: (value: string) => void;
    showError?: boolean;
};
export function SearchBar({
    onClearIconClick,
    testId,
    placeholder,
    value,
    onChange,
    showError,
}: SearchBarProps) {
    const formatMessage = useFormatMessage();
    const handleOnChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onChange?.(e.target.value);
        },
        [onChange]
    );

    return (
        <OutlinedInput
            id="search"
            data-testid={`${testId}-search-field`}
            name="search"
            placeholder={placeholder}
            startAdornment={
                <>
                    <InputAdornment position="start">
                        <SearchIcon
                            aria-label={formatMessage('search_bar.search')}
                            size="1rem"
                            data-testid={`${testId}-search-icon`}
                        />
                    </InputAdornment>
                </>
            }
            endAdornment={
                <>
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            data-testid={`${testId}-search-clear-icon`}
                            onClick={onClearIconClick}
                        >
                            <XIcon
                                aria-label={formatMessage('search_bar.clear')}
                                size="1rem"
                            />
                        </IconButton>
                    </InputAdornment>
                </>
            }
            value={value}
            onChange={onChange && handleOnChange}
            error={showError}
            fullWidth
        />
    );
}
