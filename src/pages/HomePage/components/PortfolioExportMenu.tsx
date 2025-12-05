import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Menu,
    MenuItem,
} from '@mui/material';
import { FC, MouseEvent, useCallback, useMemo, useState } from 'react';
import * as Icon from 'react-feather';
import { IPortfolioItem } from '../../../types';
import {
    useDownloadPortfolioResultSetMutation,
    useDownloadPortfolioSLRMutation,
    useDownloadSLRFilesMutation,
} from '../../../api/mutations/portfoliosMutation';
import { PortfolioExportMenuItem } from './PortfolioExportMenuItem';
import {
    getFloodResultSet,
    getPerilsResultSet,
    getScoresResultSet,
    checkIsDownloadSLRDisabled,
    getComplianceResultSet,
    getPortfolioMetricsResultSet,
} from '../../../utils';
import { MenuItemSubHeader } from '../../../components/MenuItemSubHeader/MenuItemSubHeader';
import {
    CreateSingleLocationReportInput,
    ResponseError,
} from '../../../api/openapi/auto-generated';
import { DownloadSLRModal } from './DownloadSLRModal';
import { useAddAlert } from '../../../context/AlertProvider';
import oHeap from '../../../heap-analytics';
import {
    DOWNLOAD_STD_DISCLOSURE_HAZARDS_BTN,
    DOWNLOAD_ENC_DISCLOSURE_HAZARDS_BTN,
    DOWNLOAD_MATERIALITY_WORKBOOK_BTN,
    SLR_BTN,
} from '../../../const/heap';
import { useUserContext } from '../../../context/UserContextProvider';
import {
    useDownloadCSRDUserDocumentationMutation,
    useDownloadMaterialityWorkbookMutation,
} from '../../../api/mutations/appMutation';
import { PortfolioMenuItem } from './PortfolioMenuItem';
import { PortfolioCategories } from '../../../const/PortfolioCategories';

interface PortfolioExportMenuProps {
    portfolio: IPortfolioItem;
    selectedPortfolioCategoryTab?: string;
}

export const PortfolioExportMenu: FC<PortfolioExportMenuProps> = ({
    portfolio,
    selectedPortfolioCategoryTab,
}) => {
    const { canAccessDisclosureResultSet } = useUserContext();

    const [isDownloadSLRModalOpen, setIsDownloadSLRModalOpen] = useState(false);
    const { downloadPortfolioResultSet } =
        useDownloadPortfolioResultSetMutation();
    const { downloadSLRFiles, isSLRFilesDownloading } =
        useDownloadSLRFilesMutation();
    const { downloadPortfolioSLR, isPortfolioSLRDownloading } =
        useDownloadPortfolioSLRMutation();
    const { downloadMaterialityWorkbook } =
        useDownloadMaterialityWorkbookMutation();
    const { downloadCSRDUserDocumentation } =
        useDownloadCSRDUserDocumentationMutation();
    const addAlert = useAddAlert();

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLButtonElement>(
        null
    );
    const isMenuOpen = useMemo(() => Boolean(menuAnchorEl), [menuAnchorEl]);

    const perilsResultSet = useMemo(
        () => getPerilsResultSet(portfolio),
        [portfolio]
    );
    const scoresResultSet = useMemo(
        () => getScoresResultSet(portfolio),
        [portfolio]
    );
    const floodResultSet = useMemo(
        () => getFloodResultSet(portfolio),
        [portfolio]
    );
    const portfolioMetricsResultSet = useMemo(
        () => getPortfolioMetricsResultSet(portfolio),
        [portfolio]
    );
    const disclosureResultSet = useMemo(
        () => getComplianceResultSet(portfolio),
        [portfolio]
    );

    const isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected =
        selectedPortfolioCategoryTab ===
            PortfolioCategories.PortfoliosSharedWithMe ||
        selectedPortfolioCategoryTab === PortfolioCategories.MyTeamsPortfolios;

    const handleOpenMenu = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            setMenuAnchorEl(event.currentTarget);
        },
        []
    );

    const handleCloseMenu = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleExport = useCallback(
        async (resultSetId: string, isStandard: boolean) =>
            await downloadPortfolioResultSet({
                id: resultSetId,
                isStandard,
            }),
        [downloadPortfolioResultSet]
    );

    const handleClickForDisclosureHazardDownload = useCallback(
        (isStandard: boolean) => {
            oHeap.trackCustomEvent(
                isStandard
                    ? DOWNLOAD_STD_DISCLOSURE_HAZARDS_BTN
                    : DOWNLOAD_ENC_DISCLOSURE_HAZARDS_BTN,
                {
                    from: 'portfolio',
                }
            );
        },
        []
    );

    const handleMaterialityWorkbookDownload = useCallback(async () => {
        oHeap.trackCustomEvent(DOWNLOAD_MATERIALITY_WORKBOOK_BTN, {
            from: 'portfolio',
        });
        await downloadMaterialityWorkbook();
    }, [downloadMaterialityWorkbook]);

    const handleCSRDUserDocumentationDownload = useCallback(
        async () => await downloadCSRDUserDocumentation(),
        [downloadCSRDUserDocumentation]
    );

    const isDownloadSLRDisabled = useMemo(
        () => checkIsDownloadSLRDisabled(perilsResultSet, scoresResultSet),
        [perilsResultSet, scoresResultSet]
    );

    const handleOpenDownloadSLRModal = useCallback(() => {
        setMenuAnchorEl(null);
        setIsDownloadSLRModalOpen(true);

        oHeap.trackCustomEvent(SLR_BTN, {
            from: 'portfolio',
        });
    }, []);

    const handleCloseDownloadSLRModal = useCallback(() => {
        setIsDownloadSLRModalOpen(false);
    }, []);

    const handleDownloadSLR = useCallback(
        async (
            createSingleLocationReportInput: CreateSingleLocationReportInput
        ) => {
            try {
                const slrResponse = await downloadPortfolioSLR(
                    createSingleLocationReportInput
                );
                if (
                    Array.isArray(slrResponse?.files) &&
                    slrResponse.files.length > 0
                ) {
                    await downloadSLRFiles(
                        slrResponse.files.map(({ fileId, filename }) => ({
                            fileId,
                            filename,
                        }))
                    );
                } else {
                    addAlert('No SLR files available for download.', 'warning');
                }
            } catch (error) {
                try {
                    const { detail } = await (
                        error as ResponseError
                    ).response.json();
                    addAlert(detail.detail, 'error');
                } catch (err) {
                    addAlert('Export failed, please try again later.', 'error');
                }
            }
            setIsDownloadSLRModalOpen(false);
        },
        [downloadPortfolioSLR, downloadSLRFiles, addAlert]
    );

    return (
        <>
            <ButtonGroup variant="outlined">
                <Button
                    variant="outlined"
                    onClick={handleOpenMenu}
                >
                    <Box
                        display="flex"
                        gap={1}
                        data-testid="portfolio-details-export-button"
                    >
                        Export
                    </Box>
                </Button>
                <Box>
                    <Divider orientation="vertical" />
                </Box>
                <Button
                    variant="outlined"
                    onClick={handleOpenMenu}
                    sx={{
                        padding: '0.375rem 0.5rem',
                    }}
                    data-testid="portfolio-details-export-arrow"
                >
                    <Icon.ChevronDown size="1rem" />
                </Button>
            </ButtonGroup>

            <Menu
                id="basic-menu"
                data-testid="portfolio-details-export-menu"
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    sx: {
                        width: '13.75rem',
                        background: (theme) =>
                            theme.palette.primary.contrastText,
                    },
                }}
            >
                <MenuItemSubHeader
                    title="Standard"
                    data-testid="portfolio-details-export-menu-standard"
                />
                <PortfolioExportMenuItem
                    resultSet={perilsResultSet}
                    title="Perils"
                    isStandard
                    handleExport={handleExport}
                    isHidden={
                        isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                    }
                />
                <PortfolioExportMenuItem
                    resultSet={scoresResultSet}
                    title="Scores"
                    isStandard
                    handleExport={handleExport}
                    isHidden={
                        isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                    }
                />
                <PortfolioExportMenuItem
                    resultSet={portfolioMetricsResultSet}
                    title="Portfolio Metrics"
                    isStandard
                    handleExport={handleExport}
                    isHidden={
                        isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                    }
                />
                <MenuItem
                    sx={{
                        paddingLeft: '1.5rem',
                    }}
                    disabled={isDownloadSLRDisabled}
                    onClick={handleOpenDownloadSLRModal}
                    data-testid="portfolio-details-export-menu-single-loc-report"
                >
                    Single-Location Reports
                </MenuItem>
                {canAccessDisclosureResultSet && (
                    <PortfolioExportMenuItem
                        resultSet={disclosureResultSet}
                        title="Disclosure Hazards"
                        isStandard
                        handleExport={handleExport}
                        onClickItem={handleClickForDisclosureHazardDownload}
                        isHidden={
                            isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                        }
                    />
                )}
                <PortfolioExportMenuItem
                    resultSet={floodResultSet}
                    title="Flood Mesh"
                    isStandard
                    handleExport={handleExport}
                    isHidden={
                        isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                    }
                />
                {!isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected && (
                    <MenuItemSubHeader
                        title="Enhanced"
                        description="These outputs include clear and informative headers. The formatting of the scenario labels and years are designed to be compatible with a wide range of business intelligence tools."
                        data-testid="portfolio-details-export-menu-enhanced"
                    />
                )}

                <PortfolioExportMenuItem
                    resultSet={perilsResultSet}
                    title="Perils"
                    isStandard={false}
                    handleExport={handleExport}
                    isHidden={
                        isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                    }
                />
                <PortfolioExportMenuItem
                    resultSet={scoresResultSet}
                    title="Scores"
                    isStandard={false}
                    handleExport={handleExport}
                    isHidden={
                        isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                    }
                />
                {canAccessDisclosureResultSet && (
                    <PortfolioExportMenuItem
                        resultSet={disclosureResultSet}
                        title="Disclosure Hazards"
                        isStandard={false}
                        handleExport={handleExport}
                        onClickItem={handleClickForDisclosureHazardDownload}
                        isHidden={
                            isPortfolioSharedWithMeOrMyTeamsPortfoliosTabSelected
                        }
                    />
                )}
                {canAccessDisclosureResultSet && (
                    <MenuItemSubHeader
                        title="Tools"
                        data-testid="portfolio-details-export-menu-tools"
                    />
                )}
                {canAccessDisclosureResultSet && (
                    <PortfolioMenuItem
                        title="Materiality Workbook"
                        onClick={handleMaterialityWorkbookDownload}
                    />
                )}
                {canAccessDisclosureResultSet && (
                    <PortfolioMenuItem
                        title="CSRD User Documentation"
                        onClick={handleCSRDUserDocumentationDownload}
                    />
                )}
            </Menu>

            {isDownloadSLRModalOpen && (
                <DownloadSLRModal
                    portfolio={portfolio}
                    onConfirm={handleDownloadSLR}
                    onCancel={handleCloseDownloadSLRModal}
                    isLoading={
                        isPortfolioSLRDownloading || isSLRFilesDownloading
                    }
                />
            )}
        </>
    );
};
