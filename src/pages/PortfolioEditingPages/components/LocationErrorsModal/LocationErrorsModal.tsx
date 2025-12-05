import {
    ChangeEvent,
    ComponentProps,
    FC,
    MouseEvent,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Box,
    Divider,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    Typography,
    useTheme,
} from '@mui/material';
import { FileValidationStatus } from '../../../../api/openapi/auto-generated';
import {
    getLocationValidationErrors,
    getRowValidationErrors,
} from '../../../../utils';
import { ConfirmModal } from '../../../../components/ConfirmModal/ConfirmModal';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../const';
import { IFileValidationResponse } from '../../../../types/fileValidationTypes';
import { useDownloadFileValidationLog } from '../../../../api/mutations/filesMutation';
import { FileValidationRequestStatus } from '../../../../types/fileEnum';
import { useFormatMessage } from '../../../../localization/useFormatMessage';

interface LocationError {
    code: string;
    message: string;
    rowNumber: number;
}

const getCodeType = (code: string): string =>
    ({ W: 'Warning', E: 'Error', I: 'Info' })[code[0]] || 'Unknown';

const LocationValidationErrorsTable: FC<{
    errors: LocationError[];
    idColName?: string;
}> = ({ errors, idColName = 'Row' }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

    const handleChangePage = useCallback(
        (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
            event?.preventDefault();
            setPage(newPage);
        },
        []
    );

    const handleChangeRowsPerPage = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        },
        []
    );

    return (
        <Box sx={{ bgcolor: 'background.elevated' }}>
            <TableContainer>
                <Table
                    size="small"
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {idColName}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                Issue Type
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                Issue Code
                            </TableCell>
                            <TableCell>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {errors
                            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                            .map(({ code, message, rowNumber }, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={`${rowNumber}-${code}-${index}`}
                                    >
                                        <TableCell>
                                            {rowNumber === 0 ? '' : rowNumber}
                                        </TableCell>
                                        <TableCell>
                                            {getCodeType(code)}
                                        </TableCell>
                                        <TableCell>{code}</TableCell>
                                        <TableCell>{message}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            {ROWS_PER_PAGE_OPTIONS[0] < errors.length && (
                <>
                    <Divider sx={{ paddingTop: '0.5rem', marginX: '0.5rem' }} />
                    <TablePagination
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        component="div"
                        count={errors.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </Box>
    );
};

interface LocationErrorTabs {
    label: string;
    value: 'locn' | 'row';
}

const ALL_ERROR_TABS: LocationErrorTabs[] = [
    {
        label: 'Location Messages',
        value: 'locn',
    },
    {
        label: 'Row Messages',
        value: 'row',
    },
];

const LocationValidationErrors: FC<{
    locationValidationErrors: LocationError[];
    rowValidationErrors: LocationError[];
    noValidLocations?: boolean;
}> = ({
    locationValidationErrors,
    rowValidationErrors,
    noValidLocations = false,
}) => {
    const theme = useTheme();
    const formatMessage = useFormatMessage();
    const [activeTab, setActiveTab] =
        useState<LocationErrorTabs['value']>('locn');

    const errorTabs = useMemo(() => {
        return ALL_ERROR_TABS.filter(
            (tab) =>
                (tab.value === 'locn' && locationValidationErrors.length) ||
                (tab.value === 'row' && rowValidationErrors.length)
        );
    }, [locationValidationErrors, rowValidationErrors]);

    const { disclaimer, caption } = useMemo<{
        disclaimer: string;
        caption: string;
    }>(
        () =>
            noValidLocations
                ? {
                      disclaimer: formatMessage(
                          'create_portfolio.location_errors_modal.no_valid_locations_disclaimer'
                      ),
                      caption: formatMessage(
                          'create_portfolio.location_errors_modal.no_valid_locations_caption'
                      ),
                  }
                : {
                      disclaimer: formatMessage(
                          'create_portfolio.location_errors_modal.disclaimer'
                      ),
                      caption: formatMessage(
                          'create_portfolio.location_errors_modal.caption'
                      ),
                  },
        [noValidLocations, formatMessage]
    );

    useEffect(() => {
        if (!errorTabs.length) {
            setActiveTab('locn');
            return;
        }
        if (activeTab === errorTabs[0]?.value) {
            return;
        }
        setActiveTab(errorTabs[0]?.value);
    }, [activeTab, errorTabs]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
        >
            <Typography variant="body1">{disclaimer}</Typography>
            <Box
                sx={{
                    border: `1px solid ${theme.palette.grey['500']}`,
                }}
            >
                <Box>
                    <Tabs
                        value={activeTab}
                        data-testid="tab-list"
                        sx={{ minHeight: theme.spacing(4) }}
                    >
                        {errorTabs.map(({ label, value }) => (
                            <Tab
                                key={value}
                                value={value}
                                component={'a'}
                                onClick={() => {
                                    setActiveTab(value);
                                }}
                                data-testid="tab-item"
                                label={
                                    <span
                                        style={{
                                            paddingLeft: theme.spacing(2),
                                            paddingRight: theme.spacing(2),
                                        }}
                                    >
                                        {label}
                                    </span>
                                }
                                sx={{
                                    padding: 0,
                                    minHeight: theme.spacing(4),
                                }}
                            />
                        ))}
                    </Tabs>
                    <Divider />
                </Box>
                <Box sx={{ padding: theme.spacing(1) }}>
                    {activeTab === 'locn' && (
                        <LocationValidationErrorsTable
                            errors={locationValidationErrors}
                            idColName="Location ID"
                        />
                    )}
                    {activeTab === 'row' && (
                        <LocationValidationErrorsTable
                            errors={rowValidationErrors}
                            idColName="Row"
                        />
                    )}
                </Box>
            </Box>
            <Typography variant="body1">{caption}</Typography>
        </Box>
    );
};

interface LocationErrorsModalProps extends ComponentProps<typeof Box> {
    open: boolean;
    fileValidationResult: IFileValidationResponse | undefined;
    fileValidationRequestStatus: FileValidationRequestStatus;
    onContinue?: () => void;
    onGoBack: () => void;
}

export const LocationErrorsModal: FC<LocationErrorsModalProps> = ({
    open,
    onContinue,
    onGoBack,
    fileValidationResult,
    fileValidationRequestStatus,
}) => {
    const formatMessage = useFormatMessage();
    const { downloadFileValidationLog, isFileValidationLogDownloading } =
        useDownloadFileValidationLog();
    const { locationValidationErrors, rowValidationErrors } = useMemo(() => {
        if (!fileValidationResult) {
            return { locationValidationErrors: [], rowValidationErrors: [] };
        }
        const locationValidationErrors =
            getLocationValidationErrors(fileValidationResult);
        const rowValidationErrors =
            getRowValidationErrors(fileValidationResult);

        return { locationValidationErrors, rowValidationErrors };
    }, [fileValidationResult]);

    const allFailed = useMemo<boolean>(
        () => fileValidationResult?.status === FileValidationStatus.failed,
        [fileValidationResult?.status]
    );

    const errorMessage = useMemo<string | ReactNode>(() => {
        if (
            !fileValidationResult ||
            !(locationValidationErrors.length || rowValidationErrors.length)
        ) {
            return 'Unknown error';
        }

        return (
            <LocationValidationErrors
                locationValidationErrors={locationValidationErrors}
                rowValidationErrors={rowValidationErrors}
                noValidLocations={allFailed}
            />
        );
    }, [
        fileValidationResult,
        locationValidationErrors,
        rowValidationErrors,
        allFailed,
    ]);

    const handleDownloadValidationLog = useCallback(async () => {
        if (!fileValidationResult?.id) {
            return;
        }
        await downloadFileValidationLog(fileValidationResult.id);
    }, [downloadFileValidationLog, fileValidationResult]);

    const confirmModalButtonProps = useMemo(
        () =>
            allFailed || !onContinue
                ? {
                      onConfirm: onGoBack,
                      onCancel: onGoBack,
                      confirmLabel: 'Go Back',
                      cancelLabel: '',
                  }
                : {
                      onConfirm: onContinue,
                      onCancel: onGoBack,
                      confirmLabel: 'Continue',
                      cancelLabel: 'Go Back',
                  },
        [allFailed, onContinue, onGoBack]
    );

    return (
        <Box>
            <ConfirmModal
                isOpen={open}
                title={formatMessage(
                    'create_portfolio.location_errors_modal.title'
                )}
                message={errorMessage}
                buttons={[
                    {
                        label: isFileValidationLogDownloading
                            ? formatMessage(
                                  'create_portfolio.validation_log.downloading'
                              )
                            : formatMessage(
                                  'create_portfolio.validation_log.download_validation_log'
                              ),
                        variant: 'outlined',
                        testId: 'download-validation-log-button',
                        onClick: handleDownloadValidationLog,
                        disabled:
                            fileValidationRequestStatus ===
                                FileValidationRequestStatus.Completed ||
                            isFileValidationLogDownloading,
                        tooltip:
                            fileValidationRequestStatus ===
                            FileValidationRequestStatus.Completed
                                ? formatMessage(
                                      'create_portfolio.validation_log.no_validation_errors'
                                  )
                                : '',
                        isLoading: isFileValidationLogDownloading,
                    },
                ]}
                {...confirmModalButtonProps}
            />
        </Box>
    );
};
