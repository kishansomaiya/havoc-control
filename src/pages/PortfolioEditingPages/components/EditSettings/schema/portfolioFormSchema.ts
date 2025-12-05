import { array, boolean, number, object, string } from 'yup';
import {
    isValidGICSSubIndustryCode,
    withErrorMessage,
} from '../../../../../utils/yup.util';
import {
    ALLOWED_SYMBOLS_REGEX,
    RESULT_SET_DEFAULT_YEAR_FROM,
} from '../../../../../const';
import { isValidOccupancyCode, Scenario } from '../../../../../types';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import { IPortfolio } from '../../../types/portfolio';

// Helper for .test() validations dependend on other schema fields
function schemaRoot(context: { from?: { value: unknown }[] }) {
    const from = context?.from;
    const portfolio = from?.[from.length - 1]?.value;
    if (!Object.prototype.hasOwnProperty.call(portfolio, 'custom')) {
        throw Error('Invalid schema');
    }
    return portfolio as IPortfolio;
}

const customAnalysisSettingsSchema = object({
    perilMetrics: object({
        perils: array().min(1, 'At least one peril must be selected'),
        years: array()
            .min(1, 'At least one year must be selected')
            .test(
                'perilmetrics-has-2020',
                'Year 2020 is mandatory for most dashboards and must be selected',
                (years) => years?.includes(RESULT_SET_DEFAULT_YEAR_FROM)
            )
            .test(
                'perilmetrics-has-year-1995-for-baseline-scenario',
                'You must have Year 1995 selected for Baseline Scenario',
                function(years?: number[]) {
                    const root = schemaRoot(this);
                    const scenarios = root.custom.perilMetrics.scenarios;
                    if (scenarios.includes(Scenario.Baseline)) {
                        return years?.includes(1995) ?? false;
                    }
                    return true;
                }
            ),
        scenarios: array()
            .min(1, 'At least one scenario must be selected')
            .test(
                'perilmetrics-has-baseline-scenario-for-year-1995',
                'You must have Baseline Scenario selected for Year 1995',
                function(scenarios?: Scenario[]) {
                    const root = schemaRoot(this);
                    const years = root.custom.perilMetrics.years;
                    if (years.includes(1995)) {
                        return scenarios?.includes(Scenario.Baseline) ?? false;
                    }
                    return true;
                }
            ),
    }),
    economicImpacts: object({
        defaultBuildingAttributes: object({
            occupancyCode: withErrorMessage(
                'Must be an integer >= 0',
                (message) =>
                    number().required(message).integer(message).min(0, message)
            ).test({
                name: 'is-valid-occupancy-code',
                message: 'Must be valid for selected Occupancy Scheme',
                test: function(occupancyCode) {
                    const root = schemaRoot(this);
                    const { occupancyScheme } =
                        root.custom.economicImpacts.defaultBuildingAttributes;

                    return isValidOccupancyCode(occupancyScheme, occupancyCode);
                },
            }),
            numberOfStories: withErrorMessage(
                'Must be an integer >= 0',
                (message) =>
                    number().required(message).integer(message).min(0, message)
            ),
            firstFloorElevation: number().min(
                0,
                'Must be a floating point number >= 0 or left blank'
            ),
            floorAreaSqm: number().min(
                0,
                'Must be a floating point number >= 0 or left blank'
            ),
        }),
        defaultAssetValues: object({
            total: withErrorMessage(
                'Must be a floating point number >= 0',
                (message) => number().required(message).min(0, message)
            ),
            building: withErrorMessage(
                'Must be a floating point number >= 0',
                (message) => number().required(message).min(0, message)
            ),
            contents: withErrorMessage(
                'Must be a floating point number >= 0',
                (message) => number().required(message).min(0, message)
            ),
            inventory: withErrorMessage(
                'Must be a floating point number >= 0',
                (message) => number().required(message).min(0, message)
            ),
            downtime: withErrorMessage(
                'Must be a floating point number >= 0',
                (message) => number().required(message).min(0, message)
            ),
        }),
        advancedParameters: object({
            remoteWorkRatio: withErrorMessage(
                'Must be between 0 and 1 or left blank',
                (message) => number().min(0, message).max(1, message)
            ),

            includeWorkerProductivity: boolean(),

            includeCostOfCooling: boolean(),
            costOfCooling: object({
                electricityCostUsd: number().min(
                    0,
                    'Must be a floating point number >= 0 or left blank'
                ),
            }).when('includeCostOfCooling', {
                is: true,
                then: (schema) => schema,
                otherwise: () => object(),
            }),

            workerProductivityOrCostOfCooling: object({
                coolingSystemProbability: withErrorMessage(
                    'Must be between 0 and 1 or left blank',
                    (message) => number().min(0, message).max(1, message)
                ),
            }),

            includeUtilitiesCostOfWater: boolean(),
            utilitiesCostOfWater: object({
                waterConsumption: number().min(
                    0,
                    'Must be a floating point number >= 0 or left blank'
                ),
                waterShadowPriceRatio: withErrorMessage(
                    'Must be between 0 and 1 or left blank',
                    (message) => number().min(0, message).max(1, message)
                ),
            }).when('includeUtilitiesCostOfWater', {
                is: true,
                then: (schema) => schema,
                otherwise: () => object(),
            }),
        }),
        financialParameters: object({
            includeFinancialMetrics: boolean(),
            financialMetrics: object({
                annualGrowth: withErrorMessage(
                    'Must be between 0 and 1, but not equal to 1, or left blank',
                    (message) => number().min(0, message).lessThan(1, message)
                ),
                annualVolatility: withErrorMessage(
                    'Must be between 0 and 1 or left blank',
                    (message) => number().min(0, message).max(1, message)
                ),
                subIndustryCode: string().test(
                    'format',
                    'Must be an 8-digit integer or left blank',
                    (value) =>
                        value === undefined || isValidGICSSubIndustryCode(value)
                ),
                salesMargin: withErrorMessage(
                    'Must be between 0 and 1 or left blank',
                    (message) => number().min(0, message).max(1, message)
                ),
                discountRate: withErrorMessage(
                    'Must be between 0 and 1 or left blank',
                    (message) => number().min(0, message).max(1, message)
                ),
            }).when('includeFinancialMetrics', {
                is: true,
                then: (schema) => schema,
                otherwise: () => object(),
            }),
        }),
    }),
    scores: object({
        includeBenchmarks: boolean(),
        benchmarkLevels: array().when('includeBenchmarks', {
            is: true,
            then: (schema) =>
                schema.min(1, 'At least one benchmark option must be selected'),
        }),
        perils: array().min(1, 'At least one score must be selected'),
    }),
    floodMesh: object({
        scenarios: array()
            .min(1, 'At least one scenario must be selected')
            .test(
                'floodmesh-has-baseline-scenario-for-year-1995',
                'You must have Baseline Scenario selected for Year 1995',
                function(scenarios?: Scenario[]) {
                    const root = schemaRoot(this);
                    const years = root.custom.floodMesh.years;
                    if (years.includes(1995)) {
                        return scenarios?.includes(Scenario.Baseline) ?? false;
                    }
                    return true;
                }
            ),
        years: array()
            .min(1, 'At least one year must be selected')
            .test(
                'floodmesh-has-year-1995-for-baseline-scenario',
                'You must have Year 1995 selected for Baseline Scenario',
                function(years?: number[]) {
                    const root = schemaRoot(this);
                    const scenarios = root.custom.floodMesh.scenarios;
                    if (scenarios.includes(Scenario.Baseline)) {
                        return years?.includes(1995) ?? false;
                    }
                    return true;
                }
            ),
    }),
});

export const portfolioFormSchema = object({
    name: string()
        .trim()
        .required('Name cannot be empty')
        .test(
            'no-illegal-characters',
            "Name can have only letters (a-z, A-Z), numbers (0-9), and some symbols (&, +, !, (, ), *, :, ', .)",
            (value) => {
                if (!value) return true;
                return value.match(ALLOWED_SYMBOLS_REGEX) !== null;
            }
        ),
    category: object().required('Category cannot be empty'),
    dataVersion: string().required('Data version cannot be empty'),
    type: string(),
    changeAnalysisType: boolean(),

    isPerilMetricsEnabled: boolean(),
    isEconomicImpactsEnabled: boolean(),
    isScoresEnabled: boolean(),
    isFloodMeshEnabled: boolean(),

    custom: customAnalysisSettingsSchema
        .when('type', ([type], schema) =>
            type === AnalysisType.Custom ? schema : object()
        )
        .when('changeAnalysisType', ([changeAnalysisType], schema) =>
            changeAnalysisType ? schema : object()
        ),
}).test({
    name: 'at-least-one-result-set',
    test: function(values) {
        if (!values.changeAnalysisType) {
            return true;
        }
        if (values.type !== AnalysisType.Custom) {
            return true;
        }
        const isValid =
            values.isPerilMetricsEnabled ||
            values.isEconomicImpactsEnabled ||
            values.isScoresEnabled ||
            values.isFloodMeshEnabled;
        if (isValid) {
            return true;
        }
        return this.createError({
            path: 'hasAtLeastOneResultSet',
            message: 'At least one result set type must be selected',
        });
    },
});
