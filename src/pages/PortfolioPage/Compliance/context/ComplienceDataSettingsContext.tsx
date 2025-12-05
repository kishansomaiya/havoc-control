import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';
import { DisclosureCategory } from '../../../../api/openapi/auto-generated';
import { EU_HAZARD_CATEGORY_ORDER } from '../../../../const';

const categoriesDefaultValue = [
    DisclosureCategory.water,
    DisclosureCategory.wind,
    DisclosureCategory.temperature,
    DisclosureCategory.solidMass,
].sort((a, b) =>
    EU_HAZARD_CATEGORY_ORDER[a] > EU_HAZARD_CATEGORY_ORDER[b] ? 1 : -1
);

const ComplianceCategoriesContext = createContext<DisclosureCategory[]>(
    categoriesDefaultValue
);
export const useComplianceCategories = (): DisclosureCategory[] => {
    return useContext<DisclosureCategory[]>(ComplianceCategoriesContext);
};

const UpdateComplianceCategoriesContext = createContext<
    (categories: DisclosureCategory[]) => void
>(() => {});
export const useUpdateComplianceCategories = () => {
    return useContext(UpdateComplianceCategoriesContext);
};

const ComplianceEUMetricsContext = createContext<string[]>([]);
export const useComplianceEUMetrics = (): string[] => {
    return useContext<string[]>(ComplianceEUMetricsContext);
};

const UpdateComplianceEUMetricsContext = createContext<
    (metricIds: string[]) => void
>(() => {});
export const useUpdateComplianceEUMetrics = () => {
    return useContext(UpdateComplianceEUMetricsContext);
};

export const ComplianceDataSettingsProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const categoriesSavedValue = localStorage.getItem('complianceCategories');

    let categoriesValue = categoriesSavedValue
        ? (categoriesSavedValue.split(',') as DisclosureCategory[])
        : categoriesDefaultValue;
    categoriesValue = categoriesValue.filter((value) =>
        [
            DisclosureCategory.water,
            DisclosureCategory.wind,
            DisclosureCategory.temperature,
            DisclosureCategory.solidMass,
            DisclosureCategory.unknownDefaultOpenApi,
        ].includes(value)
    );
    categoriesValue =
        categoriesValue.length > 0 ? categoriesValue : categoriesDefaultValue;

    const [categories, setCategories] =
        useState<DisclosureCategory[]>(categoriesValue);

    const euMetricsSavedValue = localStorage.getItem('euMetrics');
    const euMetricsInitialValue = euMetricsSavedValue
        ? euMetricsSavedValue.split(',').filter((id) => !!id)
        : [];

    const [euMetrics, setEUMetrics] = useState<string[]>(euMetricsInitialValue);

    const handleCategoriesChange = useCallback(
        (updatedCategories: DisclosureCategory[]) => {
            const sortedCategories = updatedCategories.sort((a, b) =>
                EU_HAZARD_CATEGORY_ORDER[a] > EU_HAZARD_CATEGORY_ORDER[b]
                    ? 1
                    : -1
            );
            localStorage.setItem(
                'complianceCategories',
                sortedCategories.join()
            );
            setCategories(sortedCategories);
        },
        []
    );

    const handleEUMetricsChange = useCallback((metricIds: string[]) => {
        localStorage.setItem('euMetrics', metricIds.join());
        setEUMetrics(metricIds);
    }, []);

    return (
        <ComplianceCategoriesContext.Provider value={categories}>
            <UpdateComplianceCategoriesContext.Provider
                value={handleCategoriesChange}
            >
                <ComplianceEUMetricsContext.Provider value={euMetrics}>
                    <UpdateComplianceEUMetricsContext.Provider
                        value={handleEUMetricsChange}
                    >
                        {children}
                    </UpdateComplianceEUMetricsContext.Provider>
                </ComplianceEUMetricsContext.Provider>
            </UpdateComplianceCategoriesContext.Provider>
        </ComplianceCategoriesContext.Provider>
    );
};
