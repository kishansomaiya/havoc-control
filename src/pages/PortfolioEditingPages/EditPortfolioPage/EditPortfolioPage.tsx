import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Tab, Tabs, Tooltip } from '@mui/material';
import { FormikProps } from 'formik';
import * as Icon from 'react-feather';
import { useNavigate, useParams } from 'react-router';
import { LoadingButton } from '@mui/lab';
import { usePortfolioQuery } from '../../../api/queries/portfoliosQuery';
import { IPortfolio } from '../types/portfolio';
import { EditPortfolioSettings } from '../components/EditSettings/EditPortfolioSettings';
import { PortfolioPageTemplate } from '../templates/PortfolioPageTemplate';
import { MAX_LIST_API_LIMIT, ROUTES } from '../../../const';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { useCategoriesQuery } from '../../../api/queries/categoriesQuery';
import { useResultSetsQuery } from '../../../api/queries/resultSetsQuery';
import { useInitialFormValues } from '../hooks/useInitialFormValues';
import { useUpdatePortfolioWithResultSetsMutation } from '../../../api/mutations/portfoliosMutation';
import { TabLabel } from '../components/TabLabel/TabLabel';
import { formatUnit } from '../../../utils';
import { usePortfolioName } from '../hooks/usePortfolioName';
import { usePortfolioCategory } from '../hooks/usePortfolioCategory';
import { usePortfolioDataVersion } from '../hooks/usePortfolioDataVersion';
import { usePortfolioEIVersion } from '../hooks/usePortfolioEIVersion';
import { preparePipeline } from '../util/resultSets/preparePipeline';
import { IPortfolioItem } from '../../../types';
import { usePortfolioRunDisclosure } from '../hooks/usePortfolioRunDisclosure';
import { ECONOMIC_IMPACTS_WITH_NO_EIMODULES_TOOLTIP_TEXT } from '../const/portfolio';

export const EditPortfolioPage = () => {
    const navigate = useNavigate();
    const { portfolioId } = useParams();

    const formRef: MutableRefObject<FormikProps<IPortfolio> | null> =
        useRef(null);
    const [isEditSettingsFormValid, setIsEditSettingsFormValid] =
        useState(false);
    const [isAnyEIModuleIsPresent, setIsAnyEIModuleIsPresent] =
        useState<boolean>(true);

    const { portfolio, isPortfolioLoading } = usePortfolioQuery(portfolioId);
    const { categories, isCategoriesLoading } = useCategoriesQuery({
        limit: MAX_LIST_API_LIMIT,
    });
    const { resultSets, isResultSetsLoading } = useResultSetsQuery({
        portfolio: portfolioId,
    });
    const portfolioWithResultSets: IPortfolioItem | undefined = useMemo(() => {
        if (portfolio === undefined) {
            return undefined;
        }
        return {
            ...portfolio,
            resultSets: resultSets.filter(
                (resultSet) => resultSet.portfolio === portfolio.id
            ),
        };
    }, [portfolio, resultSets]);
    const { updatePortfolio, cancelUpdatePortfolio, isPortfolioUpdating } =
        useUpdatePortfolioWithResultSetsMutation();

    const name = usePortfolioName({ portfolio, isPortfolioLoading });
    const category = usePortfolioCategory({
        portfolio,
        isPortfolioLoading,
        categories,
        isCategoriesLoading,
    });
    const runDisclosureAnalysis = usePortfolioRunDisclosure({
        portfolio,
        isPortfolioLoading,
    });
    const dataVersion = usePortfolioDataVersion({
        portfolio,
        resultSets,
        isResultSetsLoading,
    });
    const eiVersion = usePortfolioEIVersion({
        portfolio,
        resultSets,
        isResultSetsLoading,
    });
    const { initialFormValues } = useInitialFormValues({
        name,
        locationCount: portfolio?.locationCount,
        category,
        dataVersion,
        eiVersion,
        changeAnalysisType: false,
        runDisclosureAnalysis,
    });

    useEffect(() => {
        return () => {
            cancelUpdatePortfolio();
        };
    }, [cancelUpdatePortfolio]);

    const handleUpdatePortfolio = useCallback(
        async (portfolio: IPortfolio) => {
            if (!isEditSettingsFormValid || !portfolioId) {
                return;
            }

            const { name, category } = portfolio;
            const pipeline = preparePipeline(portfolio);
            await updatePortfolio({
                portfolioId: portfolioId,
                portfolio: {
                    name: name.trim(),
                    category: category?.id,
                },
                pipeline,
            });

            navigate(ROUTES.HOMEPAGE);
        },
        [isEditSettingsFormValid, navigate, portfolioId, updatePortfolio]
    );

    const handleUpdatePortfolioButtonClick = useCallback(() => {
        formRef.current?.submitForm();
    }, []);

    const handleCancel = useCallback(() => {
        navigate(ROUTES.HOMEPAGE);
    }, [navigate]);

    const rightToolbarButton = (
        <Tooltip
            title={
                !isAnyEIModuleIsPresent
                    ? ECONOMIC_IMPACTS_WITH_NO_EIMODULES_TOOLTIP_TEXT
                    : ''
            }
            arrow
            placement="bottom-start"
        >
            <span>
                <LoadingButton
                    variant="contained"
                    color="secondary"
                    disabled={
                        !isEditSettingsFormValid || !isAnyEIModuleIsPresent
                    }
                    onClick={handleUpdatePortfolioButtonClick}
                    loadingPosition="end"
                    loading={isPortfolioUpdating}
                    endIcon={<Icon.ChevronRight size="1rem" />}
                    data-testid="create-portfolio-save-button"
                >
                    <span>
                        {isPortfolioUpdating ? 'Saving...' : 'Save Changes'}
                    </span>
                </LoadingButton>
            </span>
        </Tooltip>
    );

    const tabs = (
        <Tabs value="edit-settings">
            <Tab
                className="MuiTab-sizeLarge"
                value="edit-settings"
                label={<TabLabel>Edit Settings</TabLabel>}
                data-testid="edit-portfolio-edit-settings-tab"
            ></Tab>
        </Tabs>
    );

    const tabContent =
        isPortfolioLoading || !initialFormValues ? (
            <TabLoadingIndicator />
        ) : (
            <EditPortfolioSettings
                initialFormValues={initialFormValues}
                onFormValidationChange={setIsEditSettingsFormValid}
                onFormSubmit={handleUpdatePortfolio}
                onEiConfigurationChange={setIsAnyEIModuleIsPresent}
                formRef={formRef}
                showChangeTypeOption={true}
                isNewPortfolio={false}
                currentPortfolioWithResultSets={portfolioWithResultSets}
            />
        );

    const pageTitle =
        isPortfolioLoading || !portfolio?.name
            ? 'Edit'
            : `Edit ${portfolio.name}`;

    const locationCount = portfolio?.locationCount;
    const subtitle =
        locationCount !== undefined
            ? formatUnit(locationCount, 'location')
            : undefined;

    return (
        <PortfolioPageTemplate
            title={pageTitle}
            subTitle={subtitle}
            rightToolBarButton={rightToolbarButton}
            onCancel={handleCancel}
            tabs={tabs}
            tabContent={tabContent}
        />
    );
};
