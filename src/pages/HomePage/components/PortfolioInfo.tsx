import { ComponentProps, FC, useMemo } from 'react';
import { IPortfolioItem } from '../../../types';
import { Box } from '@mui/material';
import {
    DamagesResultSetOptions,
    LossAssetAttributes,
    PerilsResultSetOptions,
    ScoresResultSetOptions,
} from '../../../api/openapi/auto-generated';
import { PortfolioParamsInfo } from '../../../components/PortfolioParamsInfo/PortfolioParamsInfo';

interface PortfolioInfoProps extends ComponentProps<typeof Box> {
    portfolio: IPortfolioItem;
}

export const PortfolioInfo: FC<PortfolioInfoProps> = ({ portfolio }) => {
    const perilData: PerilsResultSetOptions | null = useMemo(() => {
        const EIResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.impactsResultSetId
        );

        if (EIResultSet) {
            return (EIResultSet.options as DamagesResultSetOptions)
                .perilsOptions as PerilsResultSetOptions;
        }

        const PerilsResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.perilsResultSetId
        );
        if (PerilsResultSet) {
            return PerilsResultSet.options as PerilsResultSetOptions;
        }

        return null;
    }, [portfolio]);

    const scoreData: ScoresResultSetOptions | null = useMemo(() => {
        const ScoreResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.scoresResultSetId
        );

        if (ScoreResultSet) {
            return ScoreResultSet.options as ScoresResultSetOptions;
        }

        return null;
    }, [portfolio]);

    const economicImpactData: LossAssetAttributes | null = useMemo(() => {
        const EIResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.impactsResultSetId
        );

        if (EIResultSet) {
            return (
                (EIResultSet.options as DamagesResultSetOptions).defaults ||
                null
            );
        }

        return null;
    }, [portfolio]);

    return (
        <PortfolioParamsInfo
            perilData={perilData}
            scoreData={scoreData}
            economicImpactData={economicImpactData}
            data-testid="portfolio-details-params"
        />
    );
};
