import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import {
    Box,
    Button,
    FormControlLabel,
    FormHelperText,
    Link,
    Modal,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { IPortfolioItem } from '../../../../types';
import { MeshType } from '../../../../api/openapi/auto-generated';
import { useUserContext } from '../../../../context/UserContextProvider';
import { meshTypeTitle } from '../../../../types/meshTypeEnum';
import { Link as RouterLink } from 'react-router-dom';
import { DEFAULT_MODAL_STYLES, ROUTES } from '../../../../const';
import { useFormik } from 'formik';

type ExcludedProps = 'open' | 'children';

interface ICreateForm {
    type: MeshType;
}

interface CreateFloodMeshModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    portfolio: IPortfolioItem;
    onConfirm: (data: ICreateForm) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const initialFormValues = {
    type: MeshType.dynamic,
};

export const CreateFloodMeshModal: FC<CreateFloodMeshModalProps> = ({
    portfolio,
    onConfirm,
    onCancel,
    isLoading,
    ...props
}) => {
    const { canAccessLargeGrid } = useUserContext();

    const formik = useFormik<ICreateForm>({
        initialValues: initialFormValues,
        onSubmit: onConfirm,
        enableReinitialize: true,
    });

    const {
        setFieldValue,
        handleSubmit,
        values: { type },
    } = formik;

    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setFieldValue('type', event.target.value);
        },
        [setFieldValue]
    );

    const handleClick = useCallback(() => {
        handleSubmit();
    }, [handleSubmit]);

    return (
        <Modal
            open
            onClose={onCancel}
            {...props}
            data-testid="create-flood-mesh-modal-layer"
        >
            <Box
                sx={{
                    ...DEFAULT_MODAL_STYLES,
                    width: '37.5rem',
                    background: (theme) => theme.palette.grey['600'],
                }}
                data-testid="create-flood-mesh-modal-box"
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
                        data-testid="create-flood-mesh-modal-title"
                    >
                        Run Flood Mesh
                    </Typography>
                </Box>
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
                    <Typography
                        variant="overline"
                        data-testid="create-flood-mesh-modal-type-title"
                    >
                        Data Display
                    </Typography>

                    <Box
                        display="flex"
                        flexDirection="column"
                    >
                        <RadioGroup
                            value={type}
                            onChange={handleChange}
                            data-testid="create-flood-mesh-modal-type"
                        >
                            <FormControlLabel
                                control={<Radio color="secondary" />}
                                value={MeshType.dynamic}
                                label={meshTypeTitle(MeshType.dynamic)}
                                data-testid="create-flood-mesh-radio-button-dynamic"
                            />
                            <FormControlLabel
                                control={<Radio color="secondary" />}
                                value={MeshType.fixed}
                                label={meshTypeTitle(MeshType.fixed)}
                                disabled={!canAccessLargeGrid}
                                data-testid="create-flood-mesh-radio-button-15x15"
                            />
                            {!canAccessLargeGrid && (
                                <FormHelperText
                                    sx={{
                                        margin: 0,
                                    }}
                                    data-testid="radio-button-15x15-helptext"
                                >
                                    This option creates a large mesh around the
                                    center point. If you are interested in
                                    learning more about this feature, please
                                    speak to your CSA about upgrading.
                                </FormHelperText>
                            )}
                        </RadioGroup>
                    </Box>
                </Box>
                <Box
                    p={3}
                    gap={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.primary.contrastText}`,
                    }}
                    data-testid="create-flood-mesh-modal-edit-portfolio"
                >
                    <Typography
                        variant="body1"
                        data-testid="create-flood-mesh-modal-edit-portfolio-title"
                    >
                        This report will run with default settings. To change
                        these settings, go to Home &gt; Edit Portfolio &gt;{' '}
                        <Link
                            component={RouterLink}
                            to={ROUTES.EDIT_PORTFOLIO_PAGE.replace(
                                ':portfolioId',
                                portfolio.id
                            )}
                            variant="body1"
                            className="MuiLink-secondary"
                            color="secondary"
                            data-testid="create-flood-mesh-modal-edit-portfolio-link"
                        >
                            Edit Settings & Analysis
                        </Link>
                    </Typography>
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
                        onClick={onCancel}
                        data-testid="create-flood-mesh-modal-button-cancel"
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        variant="contained"
                        onClick={handleClick}
                        color="secondary"
                        loading={isLoading}
                        data-testid="create-flood-mesh-modal-button-confirm"
                    >
                        Run
                    </LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};
