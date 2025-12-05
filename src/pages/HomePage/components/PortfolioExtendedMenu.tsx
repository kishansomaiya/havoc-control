import { FC, useState, useMemo, useCallback, MouseEvent } from 'react';
import { Button, Menu, MenuItem, Tooltip, useTheme } from '@mui/material';
import { MoreVertical } from 'react-feather';
import { RenameAnalysisModal } from './RenameAnalysisModal';
import { IPortfolioItem } from '../../../types';
import { PipelineStatus } from '../../../api/openapi/auto-generated';
import { PortfolioCategories } from '../../../const/PortfolioCategories';

interface PortfolioExtendedMenuProps {
    portfolio: IPortfolioItem;
    selectedPortfolioCategoryTab?: string;
}

export const PortfolioExtendedMenu: FC<PortfolioExtendedMenuProps> = ({
    portfolio,
    selectedPortfolioCategoryTab,
}) => {
    const theme = useTheme();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLButtonElement>(
        null
    );
    const isMenuOpen = useMemo(() => Boolean(menuAnchorEl), [menuAnchorEl]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleOpenMenu = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            setMenuAnchorEl(event.currentTarget);
        },
        []
    );

    const handleCloseMenu = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <>
            <Tooltip
                title={
                    selectedPortfolioCategoryTab ===
                    PortfolioCategories.PortfoliosSharedWithMe
                        ? 'You do not have rights to rename this analysis. Please speak with your admin if you think this is incorrect.'
                        : ''
                }
                arrow
                placement="bottom-start"
            >
                <span>
                    {selectedPortfolioCategoryTab !==
                        PortfolioCategories.PortfoliosSharedWithMe && (
                        <Button
                            variant="outlined"
                            disabled={
                                !portfolio.pipelines?.length ||
                                portfolio.pipelines[0].status !==
                                    PipelineStatus.completed ||
                                selectedPortfolioCategoryTab ===
                                    PortfolioCategories.PortfoliosSharedWithMe
                            }
                            sx={{
                                minWidth: 'auto',
                                paddingLeft: theme.spacing(1),
                                paddingRight: theme.spacing(1),
                            }}
                            onClick={handleOpenMenu}
                        >
                            <MoreVertical size="1.25rem" />
                        </Button>
                    )}
                </span>
            </Tooltip>
            <Menu
                id="extended-menu"
                open={isMenuOpen}
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleCloseMenu}
                sx={{ marginTop: theme.spacing(0.5) }}
            >
                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        setIsModalOpen(true);
                    }}
                    data-testid="rename-analysis-menu-item"
                >
                    Rename Analysis
                </MenuItem>
            </Menu>

            {isModalOpen && (
                <RenameAnalysisModal
                    portfolio={portfolio}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};
