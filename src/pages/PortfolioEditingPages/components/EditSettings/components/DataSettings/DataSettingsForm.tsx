import { Box } from '@mui/material';
import { ComponentProps, FC } from 'react';
import { PortfolioParamsInfo } from '../../../../../../components/PortfolioParamsInfo/PortfolioParamsInfo';
import { AnalysisType } from '../../../../types/analysisTypeEnum';
import {
    DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS,
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
    DEFAULT_SCORE_RESULT_SET_OPTIONS,
} from '../../../../../../const';
import { useFormikContext } from 'formik';
import { IPortfolio } from '../../../../types/portfolio';

interface DataSettingsFormProps extends ComponentProps<typeof Box> {}

export const DataSettingsForm: FC<DataSettingsFormProps> = ({ ...props }) => {
    const formik = useFormikContext<IPortfolio>();

    const { type, dataVersion } = formik.values;

    const perilData = DEFAULT_PERIL_RESULT_SET_OPTIONS[dataVersion];
    const scoreData = DEFAULT_SCORE_RESULT_SET_OPTIONS[dataVersion];
    const economicImpactData =
        type === AnalysisType.PerilsScoresAndEconomicImpact
            ? DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[dataVersion]
            : null;

    return (
        <PortfolioParamsInfo
            perilData={perilData}
            scoreData={scoreData}
            economicImpactData={economicImpactData}
            gap={10}
            {...props}
            data-testid="data-settings-portfolio-params-info"
        />
    );
};
