import { useParams } from 'react-router';
import { usePortfolioQuery } from '../api/queries/portfoliosQuery';
import { ResultSetType } from '../api/openapi/auto-generated';
import { useMemo } from 'react';
import { useResultSetQuery } from '../api/queries/resultSetsQuery';

export const usePortfolioResultSetData = <T>(resultSetType: ResultSetType) => {
    const { portfolioId } = useParams();
    const { portfolio, isPortfolioLoading, isPortfolioError } =
        usePortfolioQuery(portfolioId);

    const resultSetId = useMemo(() => {
        if (!portfolio) {
            return undefined;
        }

        if (!portfolio.pipelines?.length) {
            return undefined;
        }

        const [pipeline] = portfolio.pipelines;

        switch (resultSetType) {
            case ResultSetType.damages:
                return pipeline.impactsResultSetId;
            case ResultSetType.perils:
                return (
                    pipeline.impactsResultSetId || pipeline.perilsResultSetId
                );
            case ResultSetType.scores:
                return pipeline.scoresResultSetId;
            case ResultSetType.mesh:
                return pipeline.meshResultSetId;
            case ResultSetType.portfolioFinancial:
                return pipeline.prplResultSetId;
            case ResultSetType.disclosure:
                return pipeline.disclosureResultSetId;
        }
    }, [resultSetType, portfolio]);

    const { resultSet, isResultSetLoading, isResultSetError } =
        useResultSetQuery({
            resultSetId,
        });

    const resultSetOptions = useMemo<T | undefined>(() => {
        if (!resultSet || !resultSet.options) {
            return;
        }
        const options = resultSet.options;
        if (options.type === 'damages') {
            return options.perilsOptions as T;
        }
        if (options.type === 'perils') {
            return options as T;
        }
        if (options.type === 'scores') {
            return options as T;
        }
        if (options.type === 'mesh') {
            return options as T;
        }
        if (options.type === 'disclosure') {
            return options as T;
        }
        return undefined;
    }, [resultSet]);

    return {
        portfolioId,
        resultSet,
        isResultSetLoading: isPortfolioLoading || isResultSetLoading,
        isResultSetError: isPortfolioError || isResultSetError,
        resultSetOptions,
    };
};
