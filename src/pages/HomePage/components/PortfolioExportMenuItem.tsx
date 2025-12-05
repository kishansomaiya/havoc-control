import { ComponentProps, FC, useCallback, useMemo, useState } from 'react';
import { MenuItem } from '@mui/material';

import {
    FileLinkResponse,
    ResultSetResponse,
} from '../../../api/openapi/auto-generated';
import { ResultSetStatus } from '../../../types';
import { downloadFile } from '../../../utils';

interface PortfolioExportMenuItemProps extends ComponentProps<typeof MenuItem> {
    resultSet?: ResultSetResponse;
    title: string;
    isStandard: boolean;
    isHidden?: boolean;
    handleExport: (
        id: string,
        isStandard: boolean
    ) => Promise<FileLinkResponse[]>;
    onClickItem?: (isStandard: boolean) => void;
}

export const PortfolioExportMenuItem: FC<PortfolioExportMenuItemProps> = ({
    resultSet,
    title,
    isStandard,
    isHidden = false,
    handleExport,
    onClickItem,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = useCallback(async () => {
        if (!resultSet) {
            return;
        }

        if (onClickItem) {
            onClickItem(isStandard);
        }

        setIsLoading(true);

        const fileLinks = await handleExport(resultSet.id, isStandard);
        fileLinks.forEach((fileLink) => {
            downloadFile(fileLink.url, fileLink.filename);
        });

        setIsLoading(false);
    }, [resultSet, isStandard, handleExport]);

    const isDisabled = useMemo(
        () =>
            !resultSet ||
            resultSet.status !== ResultSetStatus.Completed ||
            isLoading,
        [resultSet, isLoading]
    );

    return (
        <>
            {!isHidden && (
                <MenuItem
                    sx={{
                        paddingLeft: '1.5rem',
                    }}
                    disabled={isDisabled}
                    onClick={handleClick}
                    data-testid="portfolio-details-export-menu-item"
                >
                    {isLoading ? 'Downloading' : title}
                </MenuItem>
            )}
        </>
    );
};
