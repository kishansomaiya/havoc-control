import {
    APIEIModule,
    DamagesResultSetOptions,
    DamagesResultSetOptionsTypeEnum,
    MeshResultSetOptions,
    MeshResultSetOptionsTypeEnum,
    MeshResultSetOptionsYearsEnum,
    MeshType,
    PerilsResultSetOptions,
    PerilsResultSetOptionsTypeEnum,
    PerilsResultSetOptionsYearsEnum,
    ScoresResultSetOptions,
    ScoresResultSetOptionsTypeEnum,
    ScoresResultSetOptionsPerilsEnum,
} from '../../../../api/openapi/auto-generated';
import {
    roofCoverValue,
    ventTypeValue,
    windowPaneValue,
} from '../../../../types';
import { basementCodeValue } from '../../../../types/basementCodeEnum';
import { workIntensityValue } from '../../../../types/workIntensityEnum';
import { FLOOD_MESH_FIXED_SIZE } from '../../const/floodMesh';
import { IPortfolio } from '../../types/portfolio';

export function prepareEconomicImpactsResultSetOptions(
    portfolio: IPortfolio
): DamagesResultSetOptions {
    const { dataVersion, eiVersion, custom } = portfolio;
    const { economicImpacts, perilMetrics } = custom;
    const {
        advancedParameters,
        financialParameters,
        defaultBuildingAttributes,
        defaultAssetValues,
    } = economicImpacts;

    const workerProductivity: DamagesResultSetOptions['defaults'] =
        advancedParameters.includeWorkerProductivity
            ? {
                  workIntensity: advancedParameters.workerProductivity
                      .workIntensity
                      ? workIntensityValue(
                            advancedParameters.workerProductivity.workIntensity
                        )
                      : undefined,
              }
            : {};

    const costOfCooling: DamagesResultSetOptions['defaults'] =
        advancedParameters.includeCostOfCooling
            ? {
                  electricityCost:
                      advancedParameters.costOfCooling.electricityCostUsd,
              }
            : {};

    const workerProductivityOrCostOfCooling: DamagesResultSetOptions['defaults'] =
        advancedParameters.includeWorkerProductivity ||
        advancedParameters.includeCostOfCooling
            ? {
                  coolingSystemProbability:
                      advancedParameters.workerProductivityOrCostOfCooling
                          .coolingSystemProbability,
              }
            : {};

    const wildfireLoss: DamagesResultSetOptions['defaults'] =
        advancedParameters.includeWildfireLoss
            ? {
                  windowPane: advancedParameters.wildfireLoss.windowPane
                      ? windowPaneValue(
                            advancedParameters.wildfireLoss.windowPane
                        )
                      : undefined,
                  ventType: advancedParameters.wildfireLoss.ventType
                      ? ventTypeValue(advancedParameters.wildfireLoss.ventType)
                      : undefined,
                  roofCover: advancedParameters.wildfireLoss.roofCover
                      ? roofCoverValue(
                            advancedParameters.wildfireLoss.roofCover
                        )
                      : undefined,
              }
            : {};

    const utilitiesCostOfWater: DamagesResultSetOptions['defaults'] =
        advancedParameters.includeUtilitiesCostOfWater
            ? {
                  waterConsumption:
                      advancedParameters.utilitiesCostOfWater.waterConsumption,
                  waterShadowPriceRatio:
                      advancedParameters.utilitiesCostOfWater
                          .waterShadowPriceRatio,
              }
            : {};

    const financialMetrics: DamagesResultSetOptions['defaults'] =
        financialParameters.includeFinancialMetrics
            ? {
                  annualGrowth:
                      financialParameters.financialMetrics.annualGrowth,
                  annualVolatility:
                      financialParameters.financialMetrics.annualVolatility,
                  subIndustryCode:
                      financialParameters.financialMetrics.subIndustryCode,
                  salesMargin: financialParameters.financialMetrics.salesMargin,
                  discountRate:
                      financialParameters.financialMetrics.discountRate,
              }
            : {};

    const eiModules = [
        advancedParameters.includeAcuteCombinedFlood
            ? APIEIModule.acuteCombinedFlood
            : null,
        advancedParameters.includeAcuteWind ? APIEIModule.acuteWind : null,
        advancedParameters.includeCostOfCooling
            ? APIEIModule.utilitiesCooling
            : null,
        advancedParameters.includeWorkerProductivity
            ? APIEIModule.productivityHeat
            : null,
        advancedParameters.includeWildfireLoss ? APIEIModule.acuteFire : null,
        advancedParameters.includeUtilitiesCostOfWater
            ? APIEIModule.utilitiesWater
            : null,
        financialParameters.includeFinancialMetrics
            ? APIEIModule.financial
            : null,
    ].filter((module) => module !== null);

    return {
        eiModules,
        defaults: {
            occupancyScheme: defaultBuildingAttributes.occupancyScheme,
            occupancyCode: defaultBuildingAttributes.occupancyCode,
            numberOfStories: defaultBuildingAttributes.numberOfStories,
            basementCode: defaultBuildingAttributes.basementCode
                ? basementCodeValue(defaultBuildingAttributes.basementCode)
                : undefined,
            firstFloorElevation: defaultBuildingAttributes.firstFloorElevation,
            floorAreaSqm: defaultBuildingAttributes.floorAreaSqm,
            totalValue: defaultAssetValues.total,
            buildingValue: defaultAssetValues.building,
            contentsValue: defaultAssetValues.contents,
            inventoryValue: defaultAssetValues.inventory,
            downtimeValue: defaultAssetValues.downtime,
            ...workerProductivity,
            ...costOfCooling,
            ...workerProductivityOrCostOfCooling,
            remoteWorkRatio: advancedParameters.remoteWorkRatio,
            financialBaseYear: advancedParameters.financialBaseYear,
            ...wildfireLoss,
            ...utilitiesCostOfWater,
            ...financialMetrics,
        },
        perilsOptions: {
            dataVersion,
            floodDefense: perilMetrics.floodDefenseOptions,
            perils: perilMetrics.perils,
            scenarios: perilMetrics.scenarios,
            years: perilMetrics.years as PerilsResultSetOptionsYearsEnum[],
        },
        eiVersion,
        type: DamagesResultSetOptionsTypeEnum.damages,
    };
}

export function preparePerilsResultSetOptions(
    portfolio: IPortfolio
): PerilsResultSetOptions {
    const { dataVersion, custom } = portfolio;
    return {
        dataVersion: dataVersion,
        floodDefense: custom.perilMetrics.floodDefenseOptions,
        perils: custom.perilMetrics.perils,
        scenarios: custom.perilMetrics.scenarios,
        years: custom.perilMetrics.years as PerilsResultSetOptionsYearsEnum[],
        type: PerilsResultSetOptionsTypeEnum.perils,
    };
}

export function prepareScoresResultSetOptions(
    portfolio: IPortfolio
): ScoresResultSetOptions {
    const { dataVersion, custom } = portfolio;
    const { scores } = custom;
    return {
        dataVersion: dataVersion,
        perils: scores.perils as ScoresResultSetOptionsPerilsEnum[],
        includeBenchmarks: scores.includeBenchmarks,
        benchmarkLevels: scores.includeBenchmarks ? scores.benchmarkLevels : [],
        type: ScoresResultSetOptionsTypeEnum.scores,
    };
}

export function prepareFloodMeshResultSetOptions(
    portfolio: IPortfolio
): MeshResultSetOptions {
    const { dataVersion, custom } = portfolio;
    return {
        dataVersion: dataVersion,
        floodDefense: custom.floodMesh.floodDefense,
        mesh: {
            type: custom.floodMesh.mesh.type,
            width:
                custom.floodMesh.mesh.type === MeshType.fixed
                    ? FLOOD_MESH_FIXED_SIZE
                    : undefined,
            height:
                custom.floodMesh.mesh.type === MeshType.fixed
                    ? FLOOD_MESH_FIXED_SIZE
                    : undefined,
        },
        scenarios: custom.floodMesh.scenarios,
        years: custom.floodMesh.years as MeshResultSetOptionsYearsEnum[],
        type: MeshResultSetOptionsTypeEnum.mesh,
    };
}
