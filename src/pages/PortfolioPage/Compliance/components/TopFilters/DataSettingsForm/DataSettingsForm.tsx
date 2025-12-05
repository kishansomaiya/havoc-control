import {
    DisclosureCategory,
    DisclosureType,
    EUHazardMetadata,
} from '../../../../../../api/openapi/auto-generated';
import {
    ALL_CLIMATE_RELATED_CATEGORY_VALUE,
    CLIMATE_RELATED_HAZARD_TYPE_TITLES,
} from '../../../../../../const';
import { FC, useCallback, useMemo } from 'react';
import { BorderedBlock } from './BorderedBlock';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    EUHazardMetadataWithId,
    useClimateRelatedHazardCategoryWithMetrics,
} from '../../../../../../hooks/useClimateRelatedHazardCategories';
import { MetricSelectionForm } from './MetricSelectionForm';

interface Props {
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    currentlyViewedCategory:
        | DisclosureCategory
        | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE;
    selectedCategories: DisclosureCategory[];
    onSelectedCategoriesChange: (categories: DisclosureCategory[]) => void;
    selectedEUMetrics: string[];
    onSelectedEUMetricsChange: (metricIds: string[]) => void;
}

export const DataSettingsForm: FC<Props> = ({
    resultSetMetadata,
    currentlyViewedCategory,
    selectedCategories,
    onSelectedCategoriesChange,
    selectedEUMetrics,
    onSelectedEUMetricsChange,
}) => {
    const allCategories =
        useClimateRelatedHazardCategoryWithMetrics(resultSetMetadata);

    const visibleCategories = useMemo(() => {
        if (currentlyViewedCategory === ALL_CLIMATE_RELATED_CATEGORY_VALUE) {
            return allCategories;
        }

        return allCategories.filter(({ id }) => id === currentlyViewedCategory);
    }, [currentlyViewedCategory, allCategories]);

    const handleCategoryToggle = useCallback(
        (category: DisclosureCategory, selected: boolean) => {
            const updatedCategories = selected
                ? [...new Set([...selectedCategories, category])]
                : selectedCategories.filter((id) => id !== category);
            onSelectedCategoriesChange(updatedCategories);

            if (!selected) {
                return;
            }

            const enabledCategory = visibleCategories.find(
                ({ id }) => id === category
            );
            if (
                !enabledCategory ||
                currentlyViewedCategory !== ALL_CLIMATE_RELATED_CATEGORY_VALUE
            ) {
                return;
            }

            const categoryEUMetrics = [
                ...enabledCategory.types[DisclosureType.acute].metrics,
                ...enabledCategory.types[DisclosureType.chronic].metrics,
            ];
            const categoryEUMetricIds = categoryEUMetrics.map(({ id }) => id);

            const atLeastOneCategoryMetricIsSelected = categoryEUMetricIds.some(
                (id) => selectedEUMetrics.includes(id)
            );

            if (atLeastOneCategoryMetricIsSelected) {
                return;
            }

            const updatedEUMetricIds = [
                ...new Set([...selectedEUMetrics, ...categoryEUMetricIds]),
            ];

            // Check all metrics under category
            onSelectedEUMetricsChange(updatedEUMetricIds);
        },
        [
            selectedCategories,
            onSelectedCategoriesChange,
            selectedEUMetrics,
            visibleCategories,
            onSelectedEUMetricsChange,
            currentlyViewedCategory,
        ]
    );

    const updateCategoryToggle = useCallback(
        (categoryId: DisclosureCategory, enabledMetricIds: string[]) => {
            const category = visibleCategories.find(
                ({ id }) => id === categoryId
            );
            if (!category) {
                return;
            }

            const categoryEUMetrics = [
                ...category.types[DisclosureType.acute].metrics,
                ...category.types[DisclosureType.chronic].metrics,
            ];
            const categoryEUMetricIds = categoryEUMetrics.map(({ id }) => id);

            const atLeastOneCategoryMetricIsSelected = categoryEUMetricIds.some(
                (id) => enabledMetricIds.includes(id)
            );

            handleCategoryToggle(
                category.id,
                atLeastOneCategoryMetricIsSelected
            );
        },
        [visibleCategories, handleCategoryToggle]
    );

    const handleMetricSelectionChange = useCallback(
        (
            metricIdsToUpdate: string[],
            categoryEUMetrics: EUHazardMetadataWithId[]
        ) => {
            const categoryEUMetricIds = categoryEUMetrics.map(({ id }) => id);
            const idsToRemove: string[] = [];
            const idsToAdd: string[] = [];
            categoryEUMetricIds.forEach((id) => {
                const isInUpdatedList = metricIdsToUpdate.includes(id);
                const wasInSelectedList = selectedEUMetrics.includes(id);

                if (isInUpdatedList && !wasInSelectedList) {
                    idsToAdd.push(id);
                    return;
                }

                if (!isInUpdatedList && wasInSelectedList) {
                    idsToRemove.push(id);
                    return;
                }
            });

            const updatedIds = [
                ...new Set([...selectedEUMetrics, ...idsToAdd]),
            ].filter((id) => !idsToRemove.includes(id));

            onSelectedEUMetricsChange(updatedIds);

            updateCategoryToggle(categoryEUMetrics[0].category, updatedIds);
        },
        [selectedEUMetrics, onSelectedEUMetricsChange, updateCategoryToggle]
    );

    return (
        <Box
            sx={{
                overflow: 'auto',
                marginBottom: '-0.0625rem',
            }}
            data-testid="data-settings-modal-hazards-category-section"
        >
            {visibleCategories.map(({ id, title, types }) => (
                <BorderedBlock
                    data-testid="data-settings-modal-hazard-category"
                    key={id}
                >
                    {currentlyViewedCategory ===
                        ALL_CLIMATE_RELATED_CATEGORY_VALUE && (
                        <FormControlLabel
                            data-testid="data-settings-modal-hazard-category-toggle"
                            control={
                                <Switch
                                    data-testid="data-settings-modal-hazard-category-toggle-button"
                                    color="secondary"
                                    checked={selectedCategories.includes(id)}
                                    onChange={(_, checked) =>
                                        handleCategoryToggle(id, checked)
                                    }
                                />
                            }
                            label={
                                <Typography
                                    variant="subtitle1"
                                    data-testid="data-settings-modal-hazard-category-toggle-title"
                                >
                                    {title}
                                </Typography>
                            }
                        />
                    )}
                    {currentlyViewedCategory !==
                        ALL_CLIMATE_RELATED_CATEGORY_VALUE && (
                        <Typography
                            variant="subtitle1"
                            pb={2}
                        >
                            {title}
                        </Typography>
                    )}
                    <Grid container>
                        {[DisclosureType.chronic, DisclosureType.acute].map(
                            (type) => (
                                <Grid
                                    xs={6}
                                    key={type}
                                >
                                    <Typography
                                        variant="overline"
                                        color="text.highlighted"
                                        data-testid="data-settings-modal-disclosure-type-option"
                                    >
                                        {
                                            CLIMATE_RELATED_HAZARD_TYPE_TITLES[
                                                type
                                            ]
                                        }{' '}
                                        Options
                                    </Typography>
                                    <MetricSelectionForm
                                        euMetrics={types[type].metrics}
                                        disabled={
                                            !selectedCategories.includes(id) &&
                                            currentlyViewedCategory ===
                                                ALL_CLIMATE_RELATED_CATEGORY_VALUE
                                        }
                                        onMetricSelectionChange={(metricIds) =>
                                            handleMetricSelectionChange(
                                                metricIds,
                                                types[type].metrics
                                            )
                                        }
                                        selectedEUMetrics={selectedEUMetrics}
                                    />
                                </Grid>
                            )
                        )}
                    </Grid>
                </BorderedBlock>
            ))}
        </Box>
    );
};
