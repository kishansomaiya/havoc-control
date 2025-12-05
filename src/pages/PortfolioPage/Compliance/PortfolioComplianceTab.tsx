import { Box, Divider } from '@mui/material';
import { ALL_CLIMATE_RELATED_CATEGORY_VALUE } from '../../../const';
import { AllCategoriesComplianceView } from './components/AllCategories/AllCategoriesComplianceView';
import { SingleCategoryComplianceView } from './components/SingleCategory/SingleCategoryComplianceView';
import { ComplianceFiltersForm } from './components/TopFilters/ComplianceFilterForm';
import { usePortfolioComplianceData } from '../../../hooks/usePortfolioComplianceData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import { useOutletContext } from 'react-router';
import { IPortfolioItem } from '../../../types';
import { getDefaultPortfolioPageUrl } from '../../../utils';
import { DataNotAvailableModal } from '../../../components/DataNotAvailableModal/DataNotAvailableModal';
import { ComplianceDataSettingsProvider } from './context/ComplienceDataSettingsContext';
import { usePortfolioComplianceDataQuery } from '../../../api/queries/resultSetsQuery';
import { EUHazardMetadata } from '../../../api/openapi/auto-generated';

export const PortfolioComplianceTab = () => {
    const [isDataNotAvailableModalOpen, setIsDataNotAvailableModalOpen] =
        useState(false);
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();

    const {
        complianceResultSet,
        resultSetMetadata,
        isLoading,
        hasLoadingError,
        resultSetOptions,
        handleFiltersChange,
        selectedCategory,
        filterFormValues,
    } = usePortfolioComplianceData();

    const allJupiterMetricIds = useMemo<string[]>(() => {
        const uniqueMetricIds = new Set<string>();

        Object.keys(resultSetMetadata).forEach((metadataKey) => {
            const euMetricMetadata: EUHazardMetadata =
                resultSetMetadata[metadataKey];

            euMetricMetadata.metrics.forEach(({ name, tierName }) => {
                uniqueMetricIds.add(name);
                uniqueMetricIds.add(tierName);
            });

            euMetricMetadata.overviewMetrics.forEach((metricId) => {
                uniqueMetricIds.add(metricId);
            });
        });

        return Array.from(uniqueMetricIds);
    }, [resultSetMetadata]);

    const years = useMemo<number[]>(
        () => filterFormValues.years,
        [filterFormValues.years]
    );

    const { isPortfolioComplianceDataLoading, portfolioComplianceData } =
        usePortfolioComplianceDataQuery({
            resultSetId: complianceResultSet?.id,
            scenario: filterFormValues.scenario,
            years: years,
            metrics: allJupiterMetricIds,
        });

    const showLoadingIndicator = useMemo(() => {
        return isLoading || isPortfolioComplianceDataLoading;
    }, [isLoading, isPortfolioComplianceDataLoading]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isLoading && hasLoadingError && !isPortfolioComplianceDataLoading
        );
    }, [isLoading, hasLoadingError, isPortfolioComplianceDataLoading]);

    const resultSetLoaded = useMemo(() => {
        return !isLoading && !hasLoadingError && !!complianceResultSet;
    }, [isLoading, hasLoadingError, complianceResultSet]);

    useEffect(() => {
        if (!isLoading && (hasLoadingError || !complianceResultSet)) {
            setIsDataNotAvailableModalOpen(true);
        }
    }, [isLoading, hasLoadingError, complianceResultSet]);

    const handleCloseAvailableModalOpen = useCallback(() => {
        setIsDataNotAvailableModalOpen(false);
    }, []);

    const defaultNavigateRoute = useMemo(
        () => getDefaultPortfolioPageUrl(portfolioItem),
        [portfolioItem]
    );

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            position="relative"
            overflow="auto"
            data-testid="compliance-body"
        >
            <ComplianceDataSettingsProvider>
                {resultSetLoaded && (
                    <>
                        {resultSetOptions?.perilsOptions ? (
                            <ComplianceFiltersForm
                                resultSetOptions={
                                    resultSetOptions.perilsOptions
                                }
                                resultSetMetadata={resultSetMetadata}
                                urlFilterParams={filterFormValues}
                                onFiltersChange={handleFiltersChange}
                            />
                        ) : null}
                        <Divider />
                        {selectedCategory ===
                        ALL_CLIMATE_RELATED_CATEGORY_VALUE ? (
                            <AllCategoriesComplianceView
                                resultSetMetadata={resultSetMetadata}
                                years={years}
                                portfolioComplianceData={
                                    portfolioComplianceData
                                }
                            />
                        ) : null}
                        {selectedCategory !==
                        ALL_CLIMATE_RELATED_CATEGORY_VALUE ? (
                            <SingleCategoryComplianceView
                                years={years}
                                category={selectedCategory}
                                resultSetMetadata={resultSetMetadata}
                                portfolioComplianceData={
                                    portfolioComplianceData
                                }
                            />
                        ) : null}
                    </>
                )}

                {showLoadingIndicator && <TabLoadingIndicator />}

                {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}

                {isDataNotAvailableModalOpen && (
                    <DataNotAvailableModal
                        defaultRoute={defaultNavigateRoute}
                        onClose={handleCloseAvailableModalOpen}
                    />
                )}
            </ComplianceDataSettingsProvider>
        </Box>
    );
};
