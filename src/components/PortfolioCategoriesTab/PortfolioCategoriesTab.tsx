import { Box, Tab, Tabs } from '@mui/material';
import { ComponentProps, FC, SyntheticEvent } from 'react';
import { PortfolioCategories } from '../../const/PortfolioCategories';

interface PortfolioCategory {
    name: string;
    value: PortfolioCategories;
    isVisible: boolean;
}

interface PortfolioCategoriesProps extends ComponentProps<'div'> {
    currentPortfolioCategory: PortfolioCategories | undefined;
    onPortfolioCategoryChange: (category: PortfolioCategories) => void;
    portfolioCategories: PortfolioCategory[];
}

const PortfolioCategoriesTab: FC<PortfolioCategoriesProps> = ({
    currentPortfolioCategory,
    onPortfolioCategoryChange,
    portfolioCategories,
}) => {
    const handleTabChange = (
        _event: SyntheticEvent,
        newValue: PortfolioCategories
    ) => {
        onPortfolioCategoryChange(newValue);
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            alignSelf="stretch"
            width={'100%'}
        >
            <Tabs
                value={currentPortfolioCategory}
                onChange={handleTabChange}
                sx={{
                    width: '100%',
                    display: 'flex',
                    border: '2px solid #5B6368',
                }}
            >
                {portfolioCategories
                    .filter((category) => category.isVisible)
                    .map((category, index) => (
                        <Tab
                            key={category.name}
                            label={category.name}
                            value={category.value}
                            sx={{
                                flex: 1,
                                padding: '0.5rem',
                                letterSpacing: 0.75,
                                borderRight: 'none',
                                borderLeft:
                                    index === 0 ? 'none' : '2px solid #5B6368',
                                maxWidth: 'inherit',
                            }}
                            data-testid={`portfolio-category-tab-${category.value}`}
                        />
                    ))}
            </Tabs>
        </Box>
    );
};

export default PortfolioCategoriesTab;
