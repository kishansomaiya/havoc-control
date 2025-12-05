import {
    DisclosureAvailability,
    DisclosureCategory,
    DisclosureType,
    EUHazardMetadata,
} from '../api/openapi/auto-generated';

export const CLIMATE_RELATED_CATEGORY_TITLES: { [key: string]: string } = {
    [DisclosureCategory.temperature]: 'Temperature',
    [DisclosureCategory.water]: 'Water',
    [DisclosureCategory.wind]: 'Wind',
    [DisclosureCategory.solidMass]: 'Solid Mass',
};

export const ALL_CLIMATE_RELATED_CATEGORY_TITLE = 'All';
export const ALL_CLIMATE_RELATED_CATEGORY_VALUE = 'all';

export const CLIMATE_RELATED_HAZARD_TYPE_TITLES: { [key: string]: string } = {
    [DisclosureType.acute]: 'Acute',
    [DisclosureType.chronic]: 'Chronic',
};

export const EU_HAZARD_COLOR_BY_TYPE = {
    [DisclosureAvailability.available]: '#65C9C9',
    [DisclosureAvailability.riskDriver]: '#FFB74C',
    [DisclosureAvailability.notAvailable]: '#FF4E4E',
    [DisclosureAvailability.unknownDefaultOpenApi]: '#FF4E4E',
};

export const EU_HAZARD_DESCRIPTION_TITLE_BY_TYPE = {
    [DisclosureAvailability.available]: 'Jupiter Metric',
    [DisclosureAvailability.riskDriver]: 'Risk Driver',
    [DisclosureAvailability.notAvailable]: '',
    [DisclosureAvailability.unknownDefaultOpenApi]: '',
};

export const EU_HAZARD_CATEGORY_ORDER = {
    [DisclosureCategory.temperature]: 1,
    [DisclosureCategory.wind]: 2,
    [DisclosureCategory.water]: 3,
    [DisclosureCategory.solidMass]: 4,
    [DisclosureCategory.unknownDefaultOpenApi]: 5,
};

export const getEUMetricsByCategoryAndType = (
    category: DisclosureCategory,
    type: DisclosureType,
    resultSetMetadata: { [key: string]: EUHazardMetadata }
): EUHazardMetadata[] => {
    return Object.values(resultSetMetadata).filter(
        (item) => item.category === category && item.type === type
    );
};

type HazardCategoryWithMetrics = {
    [key in DisclosureCategory]: {
        id: DisclosureCategory;
        title: string;
        metrics: EUHazardMetadata[];
    };
};

export const getCategoryWithMetricsByType = (
    type: DisclosureType,
    resultSetMetadata: { [key: string]: EUHazardMetadata }
): HazardCategoryWithMetrics => {
    return Object.entries(
        CLIMATE_RELATED_CATEGORY_TITLES
    ).reduce<HazardCategoryWithMetrics>((previousValue, currentValue) => {
        const categoryId = currentValue[0] as DisclosureCategory;
        previousValue[categoryId] = {
            id: categoryId,
            title: currentValue[1],
            metrics: getEUMetricsByCategoryAndType(
                categoryId,
                type,
                resultSetMetadata
            ),
        };

        return { ...previousValue };
    }, {} as HazardCategoryWithMetrics);
};
