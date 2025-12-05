import { FC, useCallback, useMemo } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { Download } from 'react-feather';
import {
    useTenantUsageQuery,
    useUserUsageQuery,
} from '../../../api/queries/usageQuery';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0User } from '../../../types';
import { useTenantUserReportMutation } from '../../../api/mutations/useUsageMutation';

const START_TIME_YEARS_AGO = 5;

function getStartTime() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - START_TIME_YEARS_AGO);
    return date;
}

export const UsageTracking: FC = () => {
    const theme = useTheme();

    const { user } = useAuth0<Auth0User>();
    const tenantId = user?.['custom:jupiter-tenant-id'] ?? '';
    const userId = user?.['custom:jupiter-user-id'] ?? '';

    const startTime = useMemo(getStartTime, []);
    const endTime = useMemo(() => new Date(), []);
    const { data: userUsageData, isLoading: isUserUsageLoading } =
        useUserUsageQuery({ userId, tenantId, startTime, endTime });
    const { data: tenantUsageData, isLoading: isTenantUsageLoading } =
        useTenantUsageQuery({ tenantId, startTime, endTime });

    const { mutate: downloadTenantUserCsv } = useTenantUserReportMutation();

    const handleDownload = useCallback(() => {
        downloadTenantUserCsv({ tenantId, startTime, endTime });
    }, [tenantId, downloadTenantUserCsv, startTime, endTime]);

    const isUsageStatsLoading = isUserUsageLoading && isTenantUsageLoading;

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={3}
            flexGrow={1}
        >
            <Typography
                variant="overline"
                textTransform="uppercase"
            >
                Usage
            </Typography>
            {isUsageStatsLoading ? (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexGrow={1}
                >
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <>
                    <TableContainer>
                        <Table
                            size="small"
                            stickyHeader
                        >
                            <TableHead>
                                <TableRow
                                    sx={{ bgcolor: 'background.default' }}
                                >
                                    <TableCell width={150} />
                                    <TableCell width={100}>
                                        <Typography variant="h6">
                                            Portfolios
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">
                                            Locations
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ bgcolor: 'background.default' }}
                                >
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.accent"
                                        >
                                            You
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            data-testid={
                                                'usage-tracking-you-portfolios'
                                            }
                                        >
                                            {userUsageData?.totalPortfolios}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            data-testid={
                                                'usage-tracking-you-locations'
                                            }
                                        >
                                            {
                                                userUsageData?.totalUniqueLocations
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow
                                    sx={{ bgcolor: 'background.default' }}
                                >
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.accent"
                                        >
                                            Your Organization
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            data-testid={
                                                'usage-tracking-org-portfolios'
                                            }
                                        >
                                            {tenantUsageData?.totalPortfolios}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            data-testid={
                                                'usage-tracking-org-locations'
                                            }
                                        >
                                            {
                                                tenantUsageData?.totalUniqueLocations
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Box>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={handleDownload}
                    disabled={isUsageStatsLoading}
                    data-testid={'usage-tracking-download-report'}
                >
                    Download Report
                    <Download
                        size="1rem"
                        style={{ marginLeft: theme.spacing(1) }}
                    />
                </Button>
            </Box>
        </Box>
    );
};
