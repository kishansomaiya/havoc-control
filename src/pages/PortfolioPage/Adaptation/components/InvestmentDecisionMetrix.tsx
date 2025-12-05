import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useFormatMessage } from '../../../../localization/useFormatMessage';
import { useMemo } from 'react';
import { LocationAnalysisData } from '../../../../api/openapi/auto-generated';

interface InvestmentDecisionMatrixProps {
    investmentData?: LocationAnalysisData[];
    selectedRows?: LocationAnalysisData['customerLocationId'][];
}

const usdFormatter = (val: number) => {
    let output = val;
    if (Number.isNaN(Number(val))) output = 0;
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(output);
};

const columns: GridColDef[] = [
    {
        field: 'customerLocationId',
        headerName: 'Location Id',
        width: 100,
    },
    {
        field: 'name',
        headerName: 'Location Name',
        width: 180,
        flex: 1,
    },
    {
        field: 'capex',
        headerName: 'Adaptation Costs',
        width: 120,
        valueFormatter: usdFormatter,
    },
    {
        field: 'growthCapex',
        headerName: 'Required CAPEX',
        width: 120,
        valueFormatter: usdFormatter,
    },
    {
        field: 'implementationYear',
        headerName: 'Implementation Year',
        width: 140,
    },
    {
        field: 'netPresentValue',
        headerName: 'Expected NPV',
        width: 120,
        valueFormatter: usdFormatter,
    },
    {
        field: 'returnOnInvestment',
        headerName: 'ROI',
        width: 80,
    },
    {
        field: 'breakevenYear',
        headerName: 'Breakeven',
        width: 100,
    },
];

export function InvestmentDecisionMatrix({
    investmentData,
    selectedRows,
}: InvestmentDecisionMatrixProps) {
    const formatMessage = useFormatMessage();
    const selectionSet = useMemo<GridRowSelectionModel>(
        () => ({
            type: 'include',
            ids: new Set(selectedRows ?? []),
        }),
        [selectedRows]
    );
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
            data-testid="investment-matrix"
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 600,
                    }}
                >
                    {formatMessage('adaptation.tabs.investment.title')}
                </Typography>
                <Typography
                    sx={{
                        color: '#B0B0B0',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {formatMessage('adaptation.tabs.investment.label')}
                    <Box
                        component="span"
                        sx={{
                            marginLeft: '4px',
                            color: '#4FC3F7',
                            fontWeight: 600,
                        }}
                    >
                        <img
                            src="/arcadis_logo.png"
                            alt="Arcadis Logo"
                            style={{ width: '100px', marginTop: '10px' }}
                        />
                    </Box>
                </Typography>
            </Box>

            <DataGrid<LocationAnalysisData>
                rows={investmentData}
                columns={columns}
                rowSelectionModel={selectionSet}
                getRowId={(row) => row.customerLocationId}
                checkboxSelection={false}
                disableRowSelectionOnClick
                hideFooter
                sx={{
                    height: 400,
                }}
            />
        </Box>
    );
}
