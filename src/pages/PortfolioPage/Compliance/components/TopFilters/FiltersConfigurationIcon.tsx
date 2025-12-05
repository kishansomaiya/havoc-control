import * as Icon from 'react-feather';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import {
    ALL_CLIMATE_RELATED_CATEGORY_VALUE,
    DEFAULT_MODAL_STYLES,
} from '../../../../../const';
import { LoadingButton } from '@mui/lab';
import {
    useComplianceCategories,
    useComplianceEUMetrics,
    useUpdateComplianceCategories,
    useUpdateComplianceEUMetrics,
} from '../../context/ComplienceDataSettingsContext';
import {
    DisclosureCategory,
    EUHazardMetadata,
} from '../../../../../api/openapi/auto-generated';
import { BorderedBlock } from './DataSettingsForm/BorderedBlock';
import { DataSettingsForm } from './DataSettingsForm/DataSettingsForm';
import { ConfirmModal } from '../../../../../components/ConfirmModal/ConfirmModal';

interface Props {
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    currentlyViewedCategory:
        | DisclosureCategory
        | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE;
}

export const FiltersConfigurationIcon: FC<Props> = ({
    resultSetMetadata,
    currentlyViewedCategory,
}) => {
    const [isConfigurationModalOpen, setIsConfigurationModalOpen] =
        useState(false);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] =
        useState(false);
    const [isValidForm, setIsValidForm] = useState(true);
    const [isSavingConfiguration, setIsSavingConfiguration] = useState(false);
    const enabledCategories = useComplianceCategories();
    const updateEnabledCategories = useUpdateComplianceCategories();
    const [selectedCategories, setSelectedCategories] =
        useState<DisclosureCategory[]>(enabledCategories);

    const enabledEUMetricIds = useComplianceEUMetrics();
    const updateEnabledEUMetricIds = useUpdateComplianceEUMetrics();
    const [selectedEUMetrics, setSelectedEUMetrics] =
        useState<string[]>(enabledEUMetricIds);

    const handleIconClick = useCallback(() => {
        setSelectedCategories(enabledCategories);
        setSelectedEUMetrics(enabledEUMetricIds);
        setIsConfigurationModalOpen(true);
    }, [enabledCategories, enabledEUMetricIds]);

    const handleConfigurationClose = useCallback(() => {
        const metricsHaveChanges =
            enabledEUMetricIds.length !== selectedEUMetrics.length ||
            !selectedEUMetrics.every((id) => enabledEUMetricIds.includes(id));

        const categoriesHaveChanges =
            enabledCategories.length !== selectedCategories.length ||
            !selectedCategories.every((id) => enabledCategories.includes(id));

        if (!metricsHaveChanges && !categoriesHaveChanges) {
            setIsConfigurationModalOpen(false);
            setIsValidForm(true);
            return;
        }

        setIsUnsavedChangesModalOpen(true);
    }, [
        enabledEUMetricIds,
        selectedEUMetrics,
        enabledCategories,
        selectedCategories,
    ]);

    const handleDiscardChanges = useCallback(() => {
        setIsUnsavedChangesModalOpen(false);
        setIsConfigurationModalOpen(false);
        setIsValidForm(true);
    }, []);

    const handleGoBackToEditing = useCallback(() => {
        setIsUnsavedChangesModalOpen(false);
    }, []);

    const handleSaveConfiguration = useCallback(() => {
        setIsSavingConfiguration(true);
        setIsConfigurationModalOpen(false);
        updateEnabledCategories(selectedCategories);
        updateEnabledEUMetricIds(selectedEUMetrics);
        setIsSavingConfiguration(false);
    }, [
        selectedCategories,
        updateEnabledCategories,
        selectedEUMetrics,
        updateEnabledEUMetricIds,
    ]);

    const handleCategoriesSelectionChange = useCallback(
        (updatedCategories: DisclosureCategory[]) => {
            setSelectedCategories(updatedCategories);
        },
        []
    );

    const handleEUMetricsSelectionChange = useCallback(
        (metricIds: string[]) => {
            setSelectedEUMetrics(metricIds);
        },
        []
    );

    useEffect(() => {
        const hasAtLeastOneActiveCategory =
            selectedCategories.filter(
                (category) =>
                    category === currentlyViewedCategory ||
                    currentlyViewedCategory ===
                        ALL_CLIMATE_RELATED_CATEGORY_VALUE
            ).length > 0;

        if (!hasAtLeastOneActiveCategory) {
            setIsValidForm(false);
            return;
        }

        const euMetricIdsInActiveCategories = Object.keys(
            resultSetMetadata
        ).filter((euMetricId) => {
            return selectedCategories.includes(
                resultSetMetadata[euMetricId].category
            );
        });

        const hasAtLeastOneActiveEUMetric = selectedEUMetrics.some((metricId) =>
            euMetricIdsInActiveCategories.includes(metricId)
        );

        if (!hasAtLeastOneActiveEUMetric) {
            setIsValidForm(false);
            return;
        }

        setIsValidForm(true);
    }, [
        selectedCategories,
        currentlyViewedCategory,
        resultSetMetadata,
        selectedEUMetrics,
    ]);

    return (
        <>
            <IconButton
                aria-label="configuration"
                color="primary"
                onClick={handleIconClick}
                title="Open configuration dialog"
                data-testid="open-compliance-configuration-dialog-icon"
            >
                <Icon.Settings size="1.25rem" />
            </IconButton>
            {isConfigurationModalOpen ? (
                <Modal
                    open
                    onClose={handleConfigurationClose}
                >
                    <Box
                        data-testid="data-settings-modal"
                        sx={{
                            ...DEFAULT_MODAL_STYLES,
                            background: (theme) => theme.palette.grey['600'],
                        }}
                    >
                        <BorderedBlock
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography
                                    variant="h3"
                                    color="text.accent"
                                    pb={1}
                                    data-testid="data-settings-modal-title"
                                >
                                    Data Settings
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.highlighted"
                                    data-testid="data-settings-modal-description"
                                >
                                    Select which data you would like to include
                                    in your results.
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton
                                    color="primary"
                                    onClick={handleConfigurationClose}
                                    data-testid="data-settings-modal-x-icon"
                                >
                                    <Icon.X size="1.4rem" />
                                </IconButton>
                            </Box>
                        </BorderedBlock>
                        <DataSettingsForm
                            currentlyViewedCategory={currentlyViewedCategory}
                            resultSetMetadata={resultSetMetadata}
                            selectedCategories={selectedCategories}
                            onSelectedCategoriesChange={
                                handleCategoriesSelectionChange
                            }
                            selectedEUMetrics={selectedEUMetrics}
                            onSelectedEUMetricsChange={
                                handleEUMetricsSelectionChange
                            }
                        />
                        <Box
                            py={2}
                            px={3}
                            sx={{
                                borderTop: (theme) =>
                                    `0.0625rem solid ${theme.palette.primary.contrastText}`,
                            }}
                            >
                            {!isValidForm && (
                                <Box
                                justifyContent="flex-end"
                                display="flex"
                                mb={1}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.error.light,
                                        }}
                                        data-testid="data-settings-modal-error-message"
                                        >
                                        At least one metric needs to be selected
                                        and enabled
                                    </Typography>
                                </Box>
                            )}
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                >
                                <Button
                                    variant="outlined"
                                    onClick={handleConfigurationClose}
                                    data-testid="data-settings-modal-cancel-button"
                                    >
                                    Cancel
                                </Button>

                                <LoadingButton
                                    variant="contained"
                                    onClick={handleSaveConfiguration}
                                    color="secondary"
                                    loading={isSavingConfiguration}
                                    disabled={!isValidForm}
                                    data-testid="data-settings-modal-apply-button"
                                >
                                    Apply
                                </LoadingButton>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            ) : null}
            {isUnsavedChangesModalOpen ? (
                <ConfirmModal
                    isOpen
                    title="Unsaved Changes"
                    message="Would you like to continue without applying the changes?"
                    cancelLabel="Go Back"
                    confirmLabel="Discard Changes"
                    onConfirm={handleDiscardChanges}
                    onCancel={handleGoBackToEditing}
                    data-testid="unsaved-changes-modal"
                />
            ) : null}
        </>
    );
};
