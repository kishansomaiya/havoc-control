import { InconsistencyReason } from '../AdaptationVisualizations/sidebarParsingUtils';
import {
    Box,
    Divider,
    Link,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
    useTheme,
} from '@mui/material';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { PropsWithChildren, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { ConfirmModal } from '../../../../../components/ConfirmModal/ConfirmModal';

export type AssetWarningProps = {
    reason?: InconsistencyReason;
    strategyName: string;
};

export type AssetTableProps = {
    isOverridden?: boolean;
    rows: {
        customerLocationId: number;
        name?: string;
        currentValue?: unknown;
        reason?: string;
    }[];
};
export function AssetTable({ isOverridden, rows }: AssetTableProps) {
    const formatMessage = useFormatMessage();

    const parseValue = (val: unknown) =>
        val === null || val === undefined ? 'Disabled' : val.toString();
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
                                {formatMessage(
                                    'adaptation.sidebar.warning.modal.table.locationId'
                                )}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {formatMessage(
                                    'adaptation.sidebar.warning.modal.table.locationName'
                                )}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {formatMessage(
                                    isOverridden
                                        ? 'adaptation.sidebar.warning.modal.table.current_value'
                                        : 'adaptation.sidebar.warning.modal.table.description'
                                )}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(
                            ({
                                customerLocationId,
                                name,
                                reason,
                                currentValue,
                            }) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={customerLocationId}
                                    >
                                        <TableCell>
                                            {customerLocationId}
                                        </TableCell>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>
                                            {isOverridden
                                                ? parseValue(currentValue)
                                                : reason}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

type WarningTabs = 'NotApplicable' | 'Overridden';

function AssetWarningTab({
    label,
    value,
    onClick,
    isSelected,
}: {
    label: string;
    value: WarningTabs;
    isSelected: boolean;
    onClick: () => void;
}) {
    const theme = useTheme();
    return (
        <Tab
            key={value}
            value={value}
            onClick={onClick}
            data-testid={`tab-item-${value}`}
            label={
                <span
                    style={{
                        paddingLeft: theme.spacing(2),
                        paddingRight: theme.spacing(2),
                        color: isSelected ? 'white' : undefined,
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
    );
}
export function AssetMessageBody({
    reason,
    notApplicableCount,
    overriddenCount,
}: {
    reason?: AssetWarningProps['reason'];
    notApplicableCount: number;
    overriddenCount: number;
}) {
    const theme = useTheme();
    const formatMessage = useFormatMessage();
    const [activeTab, setActiveTab] = useState<WarningTabs>(
        notApplicableCount > 0 ? 'NotApplicable' : 'Overridden'
    );

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
        >
            <Typography
                variant="body1"
                color={theme.palette.grey['300']}
            >
                {formatMessage('adaptation.sidebar.warning.modal.body', {
                    notApplicableCount,
                    overriddenCount,
                })}
            </Typography>
            <Box
                sx={{
                    border: `1px solid ${theme.palette.grey['500']}`,
                }}
            >
                <Box>
                    <Tabs
                        value={activeTab}
                        data-testid="error_tab-list"
                        sx={{ minHeight: theme.spacing(4) }}
                    >
                        {notApplicableCount > 0 && (
                            <AssetWarningTab
                                isSelected={activeTab === 'NotApplicable'}
                                label={formatMessage(
                                    'adaptation.sidebar.warning.modal.tab.incompatible'
                                )}
                                value={'NotApplicable'}
                                onClick={() => setActiveTab('NotApplicable')}
                            />
                        )}
                        {overriddenCount > 0 && (
                            <AssetWarningTab
                                isSelected={activeTab === 'Overridden'}
                                label={formatMessage(
                                    'adaptation.sidebar.warning.modal.tab.overridden'
                                )}
                                value={'Overridden'}
                                onClick={() => setActiveTab('Overridden')}
                            />
                        )}
                    </Tabs>
                    <Divider />
                </Box>
                <Box sx={{ padding: theme.spacing(1) }}>
                    <AssetTable
                        rows={
                            (activeTab === 'NotApplicable'
                                ? reason?.notApplicable
                                : reason?.overridden) ?? []
                        }
                        isOverridden={activeTab === 'Overridden'}
                    />
                </Box>
            </Box>
        </Box>
    );
}
export function AssetWarning({
    children,
    reason,
    strategyName,
}: PropsWithChildren<AssetWarningProps>) {
    const formatMessage = useFormatMessage();
    const { notApplicable, overridden } = reason ?? {};
    const [isModalOpen, setIsModalOpen] = useState(false);

    const notApplicableCount = notApplicable?.length ?? 0;
    const overriddenCount = overridden?.length ?? 0;
    const modalTypeString = [
        notApplicableCount > 0 ? 'Incompatible' : undefined,
        overriddenCount > 0 ? 'Overridden' : undefined,
    ]
        .filter(Boolean)
        .join(' and ');

    const modalTitle = `${modalTypeString} Assets for ${strategyName} Adaptation Measure`;

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'8px'}
            alignItems={'start'}
        >
            {children}
            {reason ? (
                <AssetWarningText
                    reason={reason}
                    onClick={() => setIsModalOpen(true)}
                />
            ) : null}
            <ConfirmModal
                isOpen={isModalOpen}
                title={modalTitle}
                onClose={() => setIsModalOpen(false)}
                confirmLabel={formatMessage('general.close')}
                onConfirm={() => setIsModalOpen(false)}
                message={
                    <AssetMessageBody
                        notApplicableCount={notApplicableCount}
                        overriddenCount={overriddenCount}
                        reason={reason}
                    />
                }
            />
        </Box>
    );
}

export function AssetWarningText({
    reason,
    onClick,
}: {
    reason: InconsistencyReason;
    onClick: () => void;
}) {
    const formatMessage = useFormatMessage();
    const { notApplicable, overridden } = reason;

    const incompatibleString =
        notApplicable?.length > 0
            ? formatMessage('adaptation.sidebar.warning.incompatible', {
                  num: notApplicable.length,
              })
            : undefined;

    const overriddenString =
        overridden?.length > 0
            ? formatMessage('adaptation.sidebar.warning.overridden', {
                  num: overridden.length,
              })
            : undefined;

    const text = [incompatibleString, overriddenString]
        .filter(Boolean)
        .join(', ');

    return (
        <Link
            component={'button'}
            color={'inherit'}
            display={'flex'}
            gap={'8px'}
            alignItems={'center'}
            onClick={onClick}
        >
            <AlertTriangle
                size={'1rem'}
                color={'#FF9900'}
            />
            {text}
        </Link>
    );
}
