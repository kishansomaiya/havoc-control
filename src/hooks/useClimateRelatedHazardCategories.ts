import {
    CLIMATE_RELATED_CATEGORY_TITLES,
    EU_HAZARD_CATEGORY_ORDER,
} from '../const';
import {
    DisclosureCategory,
    DisclosureType,
    EUHazardMetadata,
} from '../api/openapi/auto-generated';
import { useMemo } from 'react';

export const useClimateRelatedHazardCategories = (): Array<{
    id: DisclosureCategory;
    title: string;
}> => {
    return Object.entries(CLIMATE_RELATED_CATEGORY_TITLES)
        .map(([id, title]) => ({
            id: id as DisclosureCategory,
            title,
        }))
        .sort((a, b) =>
            EU_HAZARD_CATEGORY_ORDER[a.id] > EU_HAZARD_CATEGORY_ORDER[b.id]
                ? 1
                : -1
        );
};

export interface EUHazardMetadataWithId extends EUHazardMetadata {
    id: string;
}

export const useClimateRelatedHazardCategoryWithMetrics = (resultSetMetadata: {
    [key: string]: EUHazardMetadata;
}): Array<{
    id: DisclosureCategory;
    title: string;
    types: Record<
        Extract<DisclosureType, 'chronic' | 'acute'>,
        { metrics: EUHazardMetadataWithId[]; selectedMetricIds: string[] }
    >;
}> => {
    const metadata = useMemo(
        () =>
            Object.keys(resultSetMetadata).map((id) => ({
                id,
                ...resultSetMetadata[id],
            })),
        [resultSetMetadata]
    );

    return useMemo(() => {
        return Object.entries(CLIMATE_RELATED_CATEGORY_TITLES)
            .map(([id, title]) => ({
                id: id as DisclosureCategory,
                title,
                types: {
                    [DisclosureType.chronic]: {
                        metrics: metadata.filter(
                            ({ type, category }) =>
                                type === DisclosureType.chronic &&
                                category === id
                        ),
                        selectedMetricIds: [],
                    },
                    [DisclosureType.acute]: {
                        metrics: metadata.filter(
                            ({ type, category }) =>
                                type === DisclosureType.acute && category === id
                        ),
                        selectedMetricIds: [],
                    },
                },
            }))
            .sort((a, b) =>
                EU_HAZARD_CATEGORY_ORDER[a.id] > EU_HAZARD_CATEGORY_ORDER[b.id]
                    ? 1
                    : -1
            );
    }, [metadata]);
};
