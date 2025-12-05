import { Button, ButtonGroup } from '@mui/material';
import { useClimateRelatedHazardCategories } from '../../../../../hooks/useClimateRelatedHazardCategories';
import { ComponentProps, FC } from 'react';
import {
    ALL_CLIMATE_RELATED_CATEGORY_TITLE,
    ALL_CLIMATE_RELATED_CATEGORY_VALUE,
} from '../../../../../const';
import { DisclosureCategory } from '../../../../../api/openapi/auto-generated';

type HazardCategory =
    | DisclosureCategory
    | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE;

interface HazardCategorySelectorProps
    extends ComponentProps<typeof ButtonGroup> {
    selectedCategory: HazardCategory;
    enabledCategories: HazardCategory[];
    onCategorySelected: (category: HazardCategory) => void;
}

export const HazardCategorySelector: FC<HazardCategorySelectorProps> = ({
    selectedCategory,
    onCategorySelected,
    enabledCategories,
}) => {
    const categories = useClimateRelatedHazardCategories();

    return (
        <ButtonGroup
            variant="outlined"
            size="small"
            fullWidth
            data-testid="compliance-filters-hazard-category"
        >
            <Button
                data-testid="compliance-filters-hazard-category-all"
                key="all"
                variant={
                    selectedCategory === ALL_CLIMATE_RELATED_CATEGORY_VALUE
                        ? 'contained'
                        : undefined
                }
                onClick={() =>
                    onCategorySelected(ALL_CLIMATE_RELATED_CATEGORY_VALUE)
                }
            >
                <span>{ALL_CLIMATE_RELATED_CATEGORY_TITLE}</span>
            </Button>
            {categories.map(({ id, title }) => (
                <Button
                    data-testid="compliance-filters-hazard-category-disclosure"
                    key={id}
                    variant={id === selectedCategory ? 'contained' : undefined}
                    onClick={() => onCategorySelected(id)}
                    disabled={!enabledCategories.includes(id)}
                >
                    <span data-testid="compliance-filters-hazard-category-disclosure-title" >{title}</span>
                </Button>
            ))}
        </ButtonGroup>
    );
};
