import {
    MutableRefObject,
    useCallback,
    useEffect,
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
import { useCreatePortfolioWithResultSetsMutation } from '../../../api/mutations/portfoliosMutation';
import { TabLabel } from '../components/TabLabel/TabLabel';
import { formatUnit } from '../../../utils';
import { usePortfolioName } from '../hooks/usePortfolioName';
import { usePortfolioCategory } from '../hooks/usePortfolioCategory';
import { usePortfolioDataVersion } from '../hooks/usePortfolioDataVersion';
import { usePortfolioEIVersion } from '../hooks/usePortfolioEIVersion';
import { preparePipeline } from '../util/resultSets/preparePipeline';
import oHeap from '../../../heap-analytics';
import { PORTFOLIO_CREATED } from '../../../const/heap';
import { usePortfolioRunDisclosure } from '../hooks/usePortfolioRunDisclosure';
import { ECONOMIC_IMPACTS_WITH_NO_EIMODULES_TOOLTIP_TEXT } from '../const/portfolio';

export const DuplicatePortfolioPage = () => {
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
    const { createPortfolio, cancelCreatePortfolio, isPortfolioCreating } =
        useCreatePortfolioWithResultSetsMutation();

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
        changeAnalysisType: true,
        runDisclosureAnalysis,
    });

    useEffect(() => {
        return () => {
            cancelCreatePortfolio();
        };
    }, [cancelCreatePortfolio]);

    const handleCreatePortfolio = useCallback(
        async (portfolioOptions: IPortfolio) => {
            if (!isEditSettingsFormValid || !portfolioId) {
                return;
            }
            if (isPortfolioLoading || portfolio === undefined) {
                return;
            }

            const { name, category } = portfolioOptions;
            const pipeline = preparePipeline(portfolioOptions);
            const newPortfolio = await createPortfolio({
                portfolio: {
                    name: name.trim(),
                    category: category?.id,
                    fileValidation: portfolio.fileValidation,
                    file: portfolio.file,
                },
                pipeline,
            });

            oHeap.trackCustomEvent(PORTFOLIO_CREATED, {
                portfolioName: newPortfolio.name,
                size: newPortfolio.locationCount,
            });

            navigate(ROUTES.HOMEPAGE);
        },
        [
            createPortfolio,
            isEditSettingsFormValid,
            isPortfolioLoading,
            navigate,
            portfolio,
            portfolioId,
        ]
    );

    const handleCreatePortfolioButtonClick = useCallback(() => {
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
                    onClick={handleCreatePortfolioButtonClick}
                    loadingPosition="end"
                    loading={isPortfolioCreating}
                    endIcon={<Icon.ChevronRight size="1rem" />}
                    data-testid="duplicate-portfolio-create-button"
                >
                    <span>
                        {isPortfolioCreating ? 'Creating...' : 'Create'}
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
                data-testid="duplicate-portfolio-edit-settings"
                label={<TabLabel>Edit Settings</TabLabel>}
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
                onFormSubmit={handleCreatePortfolio}
                onEiConfigurationChange={setIsAnyEIModuleIsPresent}
                formRef={formRef}
                showChangeTypeOption={false}
                isNewPortfolio={false}
                isInitialDirty
            />
        );

    const pageTitle =
        isPortfolioLoading || !portfolio?.name
            ? 'Duplicate'
            : `Duplicate ${portfolio.name}`;

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
