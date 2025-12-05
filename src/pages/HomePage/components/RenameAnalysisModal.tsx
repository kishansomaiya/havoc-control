import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DEFAULT_MODAL_STYLES } from '../../../const';
import { IPortfolioItem } from '../../../types';
import { useUpdateResultSetsMutation } from '../../../api/mutations/resultSetsMutation';
import { FormikProvider, useFormik } from 'formik';
import { renameAnalysisFormSchema } from '../schema/renameAnalysisFormSchema';
import { useFormikHelpers } from '../../../hooks/useFormikHelpers';
import { useAddAlert } from '../../../context/AlertProvider';
import { useUserContext } from '../../../context/UserContextProvider';

interface RenameAnalysisModalProps {
    portfolio: IPortfolioItem;
    onClose: () => void;
}

interface RenameAnalysisData {
    name: string;
    id: string;
}

interface RenameFormFields {
    perilName?: string;
    scoreName?: string;
    economicImpactName?: string;
    meshName?: string;
    disclosureAnalysisName?: string;
}

export const RenameAnalysisModal: FC<RenameAnalysisModalProps> = ({
    portfolio,
    onClose,
}) => {
    const addAlert = useAddAlert();
    const { canAccessDisclosureResultSet } = useUserContext();
    const { updateResultSet, isResultSetUpdating, cancelUpdateResultSet } =
        useUpdateResultSetsMutation();

    const [isUpdating, setIsUpdating] = useState(false);
    const [perilData, setPerilData] = useState<RenameAnalysisData | null>(null);
    const [scoreData, setScoreData] = useState<RenameAnalysisData | null>(null);
    const [economicImpactData, setEconomicImpactData] =
        useState<RenameAnalysisData | null>(null);
    const [meshData, setMeshData] = useState<RenameAnalysisData | null>(null);
    const [disclosureAnalysisData, setDisclosureAnalysisData] =
        useState<RenameAnalysisData | null>(null);
    const isMounted = useRef(false);

    const isLoading = useMemo(
        () => isResultSetUpdating || isUpdating,
        [isResultSetUpdating, isUpdating]
    );

    const handleClose = useCallback(() => {
        if (isLoading) {
            return;
        }

        onClose();
    }, [isLoading, onClose]);

    const handleSave = () => {
        setIsUpdating(true);
        const {
            economicImpactName,
            meshName,
            perilName,
            scoreName,
            disclosureAnalysisName,
        } = formik.values;
        const promises = [
            { id: perilData?.id ?? '', name: perilName },
            { id: scoreData?.id ?? '', name: scoreName },
            { id: economicImpactData?.id ?? '', name: economicImpactName },
            { id: meshData?.id ?? '', name: meshName },
            ...(canAccessDisclosureResultSet
                ? [
                      {
                          id: disclosureAnalysisData?.id ?? '',
                          name: disclosureAnalysisName,
                      },
                  ]
                : []),
        ]
            .filter((item) => item.id)
            .map(async ({ id, name }) => {
                return await updateResultSet({
                    resultSetId: id,
                    resultSet: { name },
                });
            });
        Promise.all(promises)
            .then(() => {
                handleClose();
            })
            .catch(() => {
                addAlert(
                    'Renaming Analysis failed, please try again.',
                    'error'
                );
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const formik = useFormik<RenameFormFields>({
        initialValues: {
            perilName: 'P_RS',
            scoreName: 'S_RS',
            economicImpactName: 'EI_RS',
            meshName: 'M_RS',
            disclosureAnalysisName: 'DH_RS',
        },
        onSubmit: handleSave,
        enableReinitialize: true,
        validationSchema: renameAnalysisFormSchema,
        validateOnChange: true,
        validateOnBlur: false,
    });

    const { setField } = useFormikHelpers(formik);

    const isFormValid = useMemo(() => {
        const {
            economicImpactName,
            meshName,
            perilName,
            scoreName,
            disclosureAnalysisName,
        } = formik.errors;
        return (
            (!perilData || !perilName) &&
            (!scoreData || !scoreName) &&
            (!economicImpactData || !economicImpactName) &&
            (!meshData || !meshName) &&
            (!disclosureAnalysisData || !disclosureAnalysisName)
        );
    }, [
        formik.errors,
        perilData,
        scoreData,
        economicImpactData,
        meshData,
        disclosureAnalysisData,
    ]);

    const handleFieldsChange = useCallback(
        (field: string, value: string) => {
            if (!field) {
                return;
            }
            setField(field, value);
        },
        [setField]
    );

    useEffect(() => {
        if (isMounted.current || isLoading) {
            return;
        }

        const PerilsResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.perilsResultSetId
        );
        if (PerilsResultSet) {
            const { name = '', id } = PerilsResultSet;
            setPerilData({ name, id });
            setField('perilName', name);
        } else {
            setPerilData(null);
            setField('perilName', '');
        }

        const ScoreResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.scoresResultSetId
        );
        if (ScoreResultSet) {
            const { name = '', id } = ScoreResultSet;
            setScoreData({ name, id });
            setField('scoreName', name);
        } else {
            setScoreData(null);
            setField('scoreName', '');
        }

        const EIResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.impactsResultSetId
        );

        if (EIResultSet) {
            const { name = '', id } = EIResultSet;
            setEconomicImpactData({ name, id });
            setField('economicImpactName', name);
        } else {
            setEconomicImpactData(null);
            setField('economicImpactName', '');
        }

        const MeshResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.meshResultSetId
        );
        if (MeshResultSet) {
            const { name = '', id } = MeshResultSet;
            setMeshData({ name, id });
            setField('meshName', name);
        } else {
            setMeshData(null);
            setField('meshName', '');
        }

        const DisclosureResultSet = portfolio.resultSets.find(
            ({ id }) => id === portfolio.pipelines?.[0]?.disclosureResultSetId
        );
        if (DisclosureResultSet && canAccessDisclosureResultSet) {
            const { name = '', id } = DisclosureResultSet;
            setDisclosureAnalysisData({ name, id });
            setField('disclosureAnalysisName', name);
        } else {
            setDisclosureAnalysisData(null);
            setField('disclosureAnalysisName', '');
        }
    }, [portfolio, isLoading]);

    useEffect(() => {
        return () => {
            cancelUpdateResultSet();
        };
    }, [cancelUpdateResultSet]);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    return (
        <Modal
            open
            onClose={handleClose}
            data-testid="rename-analysis-modal-layer"
        >
            <Box
                sx={{
                    ...DEFAULT_MODAL_STYLES,
                    background: (theme) => theme.palette.grey['600'],
                }}
                data-testid="rename-analysis-modal-box"
            >
                <Box
                    py={2}
                    px={3}
                    sx={{
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.primary.contrastText}`,
                    }}
                >
                    <Typography
                        variant="h3"
                        color="text.accent"
                        data-testid="rename-analysis-modal-title"
                    >
                        Rename Analysis of Test Portfolio
                    </Typography>
                </Box>

                <FormikProvider value={formik}>
                    <Box
                        py={2}
                        px={3}
                        gap={2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            borderBottom: (theme) =>
                                `1px solid ${theme.palette.primary.contrastText}`,
                        }}
                    >
                        {/* <Typography
                        variant="overline"
                        data-testid="download-slr-modal-include"
                    >
                        Include in Download
                    </Typography> */}

                        {perilData && (
                            <TextField
                                id="perilAnalysisName"
                                label="Perils Analysis Name"
                                placeholder="Enter Analysis Name"
                                name="perilAnalysisName"
                                fullWidth
                                value={formik.values.perilName}
                                onChange={(e) =>
                                    handleFieldsChange(
                                        'perilName',
                                        e.target.value
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.perilName &&
                                    Boolean(formik.errors.perilName)
                                }
                                helperText={
                                    formik.touched.perilName &&
                                    Boolean(formik.errors.perilName)
                                        ? formik.errors.perilName
                                        : ''
                                }
                            />
                        )}
                        {scoreData && (
                            <TextField
                                id="scoreAnalysisName"
                                label="Scores Analysis Name"
                                placeholder="Enter Analysis Name"
                                name="scoreAnalysisName"
                                fullWidth
                                value={formik.values.scoreName}
                                onChange={(e) =>
                                    handleFieldsChange(
                                        'scoreName',
                                        e.target.value
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.scoreName &&
                                    Boolean(formik.errors.scoreName)
                                }
                                helperText={
                                    formik.touched.scoreName &&
                                    Boolean(formik.errors.scoreName)
                                        ? formik.errors.scoreName
                                        : ''
                                }
                            />
                        )}
                        {economicImpactData && (
                            <TextField
                                id="impactAnalysisName"
                                label="Impacts Analysis Name"
                                placeholder="Enter Analysis Name"
                                name="impactAnalysisName"
                                fullWidth
                                value={formik.values.economicImpactName}
                                onChange={(e) =>
                                    handleFieldsChange(
                                        'economicImpactName',
                                        e.target.value
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.economicImpactName &&
                                    Boolean(formik.errors.economicImpactName)
                                }
                                helperText={
                                    formik.touched.economicImpactName &&
                                    Boolean(formik.errors.economicImpactName)
                                        ? formik.errors.economicImpactName
                                        : ''
                                }
                            />
                        )}
                        {meshData && (
                            <TextField
                                id="meshAnalysisName"
                                label="Mesh Analysis Name"
                                placeholder="Enter Analysis Name"
                                name="meshAnalysisName"
                                fullWidth
                                value={formik.values.meshName}
                                onChange={(e) =>
                                    handleFieldsChange(
                                        'meshName',
                                        e.target.value
                                    )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.meshName &&
                                    Boolean(formik.errors.meshName)
                                }
                                helperText={
                                    formik.touched.meshName &&
                                    Boolean(formik.errors.meshName)
                                        ? formik.errors.meshName
                                        : ''
                                }
                            />
                        )}
                        {canAccessDisclosureResultSet &&
                            disclosureAnalysisData && (
                                <TextField
                                    id="disclosureAnalysisName"
                                    label="Disclosure Analysis Name"
                                    placeholder="Enter Analysis Name"
                                    name="disclosureAnalysisName"
                                    fullWidth
                                    value={formik.values.disclosureAnalysisName}
                                    onChange={(e) =>
                                        handleFieldsChange(
                                            'disclosureAnalysisName',
                                            e.target.value
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.disclosureAnalysisName &&
                                        Boolean(
                                            formik.errors.disclosureAnalysisName
                                        )
                                    }
                                    helperText={
                                        formik.touched.disclosureAnalysisName &&
                                        Boolean(
                                            formik.errors.disclosureAnalysisName
                                        )
                                            ? formik.errors
                                                  .disclosureAnalysisName
                                            : ''
                                    }
                                />
                            )}
                    </Box>
                    <Box
                        py={2}
                        px={3}
                        gap={2}
                        display="flex"
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="outlined"
                            disabled={isLoading}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={handleSave}
                            loading={isLoading}
                            disabled={!isFormValid}
                        >
                            Save
                        </LoadingButton>
                    </Box>
                </FormikProvider>
            </Box>
        </Modal>
    );
};
