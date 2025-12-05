import { ComponentProps, FC } from 'react';
import { Box, Typography } from '@mui/material';
import { RunAnalysisOption } from './RunAnalysisOption';
import { useFormikContextHelpers } from '../../../../../hooks/useFormikContextHelpers';
import { IPortfolio } from '../../../types/portfolio';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { useUserContext } from '../../../../../context/UserContextProvider';
import {
    isAdaptationOpportunitiesAnalysisAllowedDataVersion,
    isDisclosureAllowedDataVersion,
} from '../../../../../utils';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import { useFeatureFlags } from '../../../../../featureFlags/useFeatureFlags';

interface AdditionalAnalysesProps extends ComponentProps<typeof Box> {
    isRunDisclosureEnabled?: boolean;
    isRunAdaptationOpportunitiesAnalysisEnabled?: boolean;
}

export const AdditionalAnalyses: FC<AdditionalAnalysesProps> = ({
    isRunDisclosureEnabled = true,
    isRunAdaptationOpportunitiesAnalysisEnabled = true,
    ...props
}) => {
    const formatMessage = useFormatMessage();
    const { adaptationModuleEnabled } = useFeatureFlags(
        'adaptationModuleEnabled'
    );
    const { canAccessDisclosureResultSet } = useUserContext();
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
                width: '100%',
            }}
            {...props}
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="additional-analyses-label"
            >
                {formatMessage('create_portfolio.edit_settings.additional_analysis')}
            </Typography>
            {adaptationModuleEnabled && (
                <RunAnalysisOption
                    title={formatMessage(
                        'create_portfolio.edit_settings.run_adaptation_analysis'
                    )}
                    description={formatMessage(
                        'create_portfolio.edit_settings.run_adaptation_analysis_description'
                    )}
                    isSelected={
                        formik.values.runAdaptationOpportunitiesAnalysis ?? false
                    }
                    onChange={(value: boolean) => {
                        setField('runAdaptationOpportunitiesAnalysis', value);
                    }}
                    disabled={
                        !(
                            adaptationModuleEnabled &&
                            isRunAdaptationOpportunitiesAnalysisEnabled &&
                            isAdaptationOpportunitiesAnalysisAllowedDataVersion(
                                formik.values.dataVersion
                            ) &&
                            formik.values.type === AnalysisType.PerilsScoresAndEconomicImpact
                        )
                    }
                    testId="run-adaptation-opportunities-analysis"
                    disabledTooltip={formatMessage(
                        'create_portfolio.edit_settings.run_adaptation_analysis_tooltip'
                    )}
                />
            )}

            {canAccessDisclosureResultSet && (
                <RunAnalysisOption
                    title={formatMessage(
                        'create_portfolio.edit_settings.run_disclosure_analysis'
                    )}
                    description={formatMessage(
                        'create_portfolio.edit_settings.run_disclosure_analysis_description'
                    )}
                    isSelected={formik.values.runDisclosureAnalysis ?? false}
                    onChange={(value: boolean) => {
                        setField('runDisclosureAnalysis', value);
                    }}
                    disabled={
                        !(
                            isRunDisclosureEnabled &&
                            isDisclosureAllowedDataVersion(
                                formik.values.dataVersion
                            ) &&
                            formik.values.type !== AnalysisType.Custom
                        )
                    }
                    testId="run-disclosure-analysis"
                    disabledTooltip={formatMessage(
                        'create_portfolio.edit_settings.run_disclosure_analysis_tooltip'
                    )}
                />
            )}
        </Box>
    );
};