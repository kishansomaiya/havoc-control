import { PortfolioCategories } from '../const/PortfolioCategories';

export const getInitialTab = (
    categories: {
        name: string;
        value: PortfolioCategories;
        isVisible: boolean | undefined;
    }[]
) => {
    const visibleTabs = categories.filter((category) => category.isVisible);
    return visibleTabs.length > 0 ? visibleTabs[0].value : null; // or a default value
};
