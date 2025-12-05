import { useMemo } from 'react';
import { FinancialMetricViewType } from '../types';
import { FINANCIAL_METRIC_VIEW_TYPE_TITLES } from '../const/financialMetricViewTypeTitles';

export const useFinancialMetricViewTypeOptions = (): Array<{
    id: FinancialMetricViewType;
    title: string;
}> => {
    return useMemo(() => {
        return Object.entries(FINANCIAL_METRIC_VIEW_TYPE_TITLES).map(
            ([id, title]) => ({
                id: id as FinancialMetricViewType,
                title,
            })
        );
    }, []);
};
