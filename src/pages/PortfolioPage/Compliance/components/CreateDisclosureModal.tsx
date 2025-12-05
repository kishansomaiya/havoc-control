import { ComponentProps, FC, useCallback } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { IPortfolioItem } from '../../../../types';
import { useUserContext } from '../../../../context/UserContextProvider';
import { DEFAULT_MODAL_STYLES } from '../../../../const';

type ExcludedProps = 'open' | 'children';

interface CreateDisclosureModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    portfolio: IPortfolioItem;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export const CreateDisclosureModal: FC<CreateDisclosureModalProps> = ({
    portfolio,
    onConfirm,
    onCancel,
    isLoading,
    ...props
}) => {
    const { canAccessDisclosureResultSet } = useUserContext();

    const handleClick = useCallback(() => {
        if(canAccessDisclosureResultSet) {
            onConfirm();
        }
    }, [canAccessDisclosureResultSet]);

    return (
        <Modal
            open
            onClose={onCancel}
            {...props}
            data-testid="create-disclosure-modal-layer"
        >
            <Box
                sx={{
                    ...DEFAULT_MODAL_STYLES,
                    width: '37.5rem',
                    background: (theme) => theme.palette.grey['600'],
                }}
                data-testid="create-disclosure-modal-box"
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
                        data-testid="create-disclosure-modal-title"
                    >
                        Run Disclosure Hazard Result Set
                    </Typography>
                </Box>
                <Box
                    py={2}
                    px={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.primary.contrastText}`,
                    }}
                >
                    <Typography
                        variant="body1"
                        data-testid="csrd-modal-content"
                        my={2}
                    >
                        To access features in this tab for this portfolio you
                        will need to run the Disclosure Hazard Result Set, which
                        includes the following data:
                    </Typography>
                    <Box
                        component="ol"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            pl: 2.5,
                            my: 2,
                        }}
                    >
                        <Typography
                            component="li"
                            variant="body1"
                        >
                            Disclosure Hazard Metrics
                        </Typography>
                        <Typography
                            component="li"
                            variant="body1"
                        >
                            Years: 2020, 2025, 2030, 2040, 2050, 2075, 2100
                        </Typography>
                        <Typography
                            component="li"
                            variant="body1"
                        >
                            Scenarios: SSP1-2.6, SSP2-4.5, SSP5-8.5
                        </Typography>
                    </Box>
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
                        data-testid="create-disclosure-modal-button-cancel"
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        variant="contained"
                        onClick={handleClick}
                        color="secondary"
                        loading={isLoading}
                        data-testid="create-disclosure-modal-button-confirm"
                    >
                        Run
                    </LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};
