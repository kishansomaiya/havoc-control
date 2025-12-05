import {
    BenchmarkLevel,
    DataVersion,
    GLOBAL_BENCHMARK_LEVEL,
    IPortfolioItem,
    Score,
} from '../types';
import { numberFormatter } from './formatter.util';
import {
    ROUTES,
    SCORE_CHANGE_FIELDS,
    SCORE_HAZARD_FIELDS,
    SCORE_OVERALL_FIELDS,
} from '../const';
import { getPerilsResultSet, getScoresResultSet } from './resultSet.util';

export const getLocationCountLabel = (locationCount?: number): string =>
    `${locationCount ? numberFormatter(locationCount) : 0} Location${
        locationCount !== 1 ? 's' : ''
    }`;

const DEFAULT_SCORING_PROPERTY_SUFFIX = 'score';

const SCORING_PROPERTY_SUFFIX = {
    [BenchmarkLevel.Admin1]: 'pctAdmin1',
    [BenchmarkLevel.Admin2]: 'pctAdmin2',
    [BenchmarkLevel.Country]: 'pctCountry',
    [GLOBAL_BENCHMARK_LEVEL]: DEFAULT_SCORING_PROPERTY_SUFFIX,
};

export const getPortfolioScoringPropNames = (props: {
    benchmarkLevel: BenchmarkLevel | typeof GLOBAL_BENCHMARK_LEVEL;
    score?: Score;
}) => {
    const { benchmarkLevel, score = Score.All } = props;

    const suffixByBenchmarkLevel: string =
        SCORING_PROPERTY_SUFFIX[benchmarkLevel];

    const overallPropName = SCORE_OVERALL_FIELDS[score]?.replace(
        DEFAULT_SCORING_PROPERTY_SUFFIX,
        suffixByBenchmarkLevel
    );
    const changePropName = SCORE_CHANGE_FIELDS[score]?.replace(
        DEFAULT_SCORING_PROPERTY_SUFFIX,
        suffixByBenchmarkLevel
    );
    const hazardPropName = SCORE_HAZARD_FIELDS[score]?.replace(
        DEFAULT_SCORING_PROPERTY_SUFFIX,
        suffixByBenchmarkLevel
    );

    return { overallPropName, changePropName, hazardPropName };
};

export const getSelectedPortfolioLocationUrl = (
    portfolioId: string,
    locationId: number
) =>
    `${ROUTES.PORTFOLIO_PAGE.replace(
        ':portfolioId',
        encodeURIComponent(portfolioId)
    )}/${ROUTES.PORTFOLIO_TABS.LOCATIONS}?locationId=${locationId}`;

export const getDefaultPortfolioPageUrl = (portfolio: IPortfolioItem) => {
    const scoreResultSet = getScoresResultSet(portfolio);

    if (scoreResultSet) {
        return ROUTES.PORTFOLIO_PAGE.replace(
            ':portfolioId',
            encodeURIComponent(portfolio.id)
        );
    }

    const perilResultSet = getPerilsResultSet(portfolio);

    if (perilResultSet) {
        return `${ROUTES.PORTFOLIO_PAGE.replace(
            ':portfolioId',
            encodeURIComponent(portfolio.id)
        )}/${ROUTES.PORTFOLIO_TABS.HAZARD}`;
    }

    return `${ROUTES.PORTFOLIO_PAGE.replace(
        ':portfolioId',
        encodeURIComponent(portfolio.id)
    )}/${ROUTES.PORTFOLIO_TABS.LOCATIONS}`;
};

export const isDisclosureAllowedDataVersion = (
    dataVersion?: DataVersion | null
) => {
    if (!dataVersion) {
        return false;
    }
    return [DataVersion.v3_2_0].includes(dataVersion); // TODO: add more allowed data versions in the list
};

export const isAdaptationOpportunitiesAnalysisAllowedDataVersion = (
    dataVersion?: DataVersion | null
) => {
    if (!dataVersion) {
        return false;
    }
    return [DataVersion.v3_3_0].includes(dataVersion); // TODO: When v3.3.0 is released, add it to the list
};


export const isVersionGreaterOrEqual = (version: string | null, target: string): boolean => {
    if (!version) return false;
    
    const parseVersion = (v: string) => v.split('.').map(Number);
    const versionParts = parseVersion(version);
    const targetParts = parseVersion(target);
    
    for (let i = 0; i < targetParts.length; i++) {
        if (versionParts[i] > targetParts[i]) return true;
        if (versionParts[i] < targetParts[i]) return false;
    }
    return true;
};