import { Box, Typography } from '@mui/material';
import CapitalExpenditureTimeline from '../Charts/CapitalExpeditureTimeline';
import { InvestmentDecisionMatrix } from '../InvestmentDecisionMetrix';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { useMemo } from 'react';
import { abbreviateNumber } from '../../../../../utils';
import { LocationAnalysisData } from '../../../../../api/openapi/auto-generated';

export type CapexTabProps = {
    investmentData?: LocationAnalysisData[];
    capitalCommitment: number;
    peakAnnualInvestment: number;
    averageAnnualCapex: number;
    capexYears: number[];
    capexAnnualExpenditure: number[];
};

export function CapexTab({
    investmentData,
    capitalCommitment,
    peakAnnualInvestment,
    averageAnnualCapex,
    capexYears,
    capexAnnualExpenditure,
}: CapexTabProps) {
    const formatMessage = useFormatMessage();

    const capexCumulative = useMemo(
        () =>
            capexAnnualExpenditure?.reduce((acc, curr, i) => {
                if (i === 0) {
                    return [curr];
                }

                return [...acc, curr + acc[i - 1]];
            }, [] as number[]),
        [capexAnnualExpenditure]
    );

    return (
        <Box padding={'0 0 24px'}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10%',
                    padding: '16px 0',
                    color: '#fff',
                    width: '100%',
                    textAlign: 'center',
                    marginLeft: 'auto',
                    borderBottom: '1px solid #8D9498',
                    paddingBottom: '24px',
                    marginBottom: '24px',
                }}
                data-testid="capex-tab-data-container"
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '14px',
                            color: '#FFFFFF',
                            marginBottom: '4px',
                        }}
                        data-testid="capital-commitment-label"
                    >
                        {formatMessage(
                            'adaptation.tabs.capex.capital.commitment'
                        )}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '30px',
                            color: '#FFFFFF',
                            fontWeight: 600,
                        }}
                    >
                        {`$${abbreviateNumber(capitalCommitment)}`}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '14px',
                            color: '#FFFFFF',
                            marginBottom: '4px',
                        }}
                        data-testid="peak-annual-investment-label"
                    >
                        {formatMessage(
                            'adaptation.tabs.capex.annual.investment'
                        )}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '30px',
                            color: '#FFFFFF',
                            fontWeight: 600,
                        }}
                    >
                        {`$${abbreviateNumber(peakAnnualInvestment)}`}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '14px',
                            color: '#FFFFFF',
                            marginBottom: '4px',
                        }}
                        data-testid="average-annual-capex-label"
                    >
                        {formatMessage('adaptation.tabs.capex.annual.capex')}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '30px',
                            color: '#FFFFFF',
                            fontWeight: 600,
                        }}
                    >
                        {`$${abbreviateNumber(averageAnnualCapex)}`}
                    </Typography>
                </Box>
            </Box>

            <CapitalExpenditureTimeline
                years={capexYears}
                annualExpenditure={capexAnnualExpenditure}
                cumulativeInvestment={capexCumulative}
            />
            <InvestmentDecisionMatrix investmentData={investmentData} />
        </Box>
    );
}
