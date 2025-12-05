import { Box, Divider } from '@mui/material';
import { LocationExposureByHazardAndYear } from './components/LocationExposureByHazardAndYear';
import { ComplianceHazardScoresTable } from './components/ComplianceHazardScoresTable';
import { ComponentProps, FC } from 'react';
import { EUHazardMetadata } from '../../../../../api/openapi/auto-generated';

interface AllCategoriesComplianceViewProps extends ComponentProps<typeof Box> {
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    years: number[];
    portfolioComplianceData: { [key: string]: string | number }[];
}

export const AllCategoriesComplianceView: FC<
    AllCategoriesComplianceViewProps
> = ({ resultSetMetadata, years, portfolioComplianceData }) => {
    return (
        <Box
            flexGrow={1}
            overflow="auto"
            position="relative"
            data-testid="compliance-charts-all"
        >
            <Box
                px={4}
                py={3}
                data-testid="compliance-location-exposure-by-hazard-and-year-chart"
            >
                <LocationExposureByHazardAndYear
                    years={years}
                    resultSetMetadata={resultSetMetadata}
                    portfolioComplianceData={portfolioComplianceData}
                />
            </Box>
            <Divider />
            <Box
                px={4}
                py={3}
                data-testid="compliance-eu-hazard-alignment"
            >
                <ComplianceHazardScoresTable
                    resultSetMetadata={resultSetMetadata}
                />
            </Box>
        </Box>
    );
};
