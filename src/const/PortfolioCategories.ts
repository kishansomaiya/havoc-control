import { ListingMode } from '../api/openapi/auto-generated';

export enum PortfolioCategories {
    MyPortfolios = 'myPortfolios',
    PortfoliosSharedWithMe = 'portfoliosSharedWithMe',
    MyTeamsPortfolios = 'myTeamsPortfolios',
}

export const PORTFOLIO_CATEGORIES_PARAMETER: Record<
    PortfolioCategories,
    ListingMode
> = {
    [PortfolioCategories.MyPortfolios]: 'owner',
    [PortfolioCategories.PortfoliosSharedWithMe]: 'shared',
    [PortfolioCategories.MyTeamsPortfolios]: 'tenant',
};
