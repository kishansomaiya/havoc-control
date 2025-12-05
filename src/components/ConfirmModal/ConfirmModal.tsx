import { ComponentProps, FC, ReactNode } from 'react';
import { Typography, Button, Box, Modal, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DEFAULT_MODAL_STYLES } from '../../const';
import * as Icon from 'react-feather';

type ExcludedProps = 'open' | 'children';

interface ButtonProps {
    label: string;
    variant: 'outlined' | 'contained';
    testId: string;
    onClick: () => void;
    btnStyles?: React.CSSProperties;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
    disabled?: boolean;
    isLoading?: boolean;
    tooltip?: string | ReactNode;
}

interface ConfirmModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    title: string;
    isOpen?: boolean;
    message: string | ReactNode;
    onConfirm?: () => void;
    onCancel?: (event: object, reason?: string) => void;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    buttons?: ButtonProps[];
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isOpen = true,
    isLoading = false,
    isDisabled = false,
    buttons,
    ...props
}) => {
    return (
        <Modal
            open={isOpen}
            onClose={onCancel}
            {...props}
            data-testid="confirm-modal-layer"
        >
            <Box
                sx={{
                    ...DEFAULT_MODAL_STYLES,
                    background: (theme) => theme.palette.grey['600'],
                }}
                data-testid="confirm-modal-box"
            >
                <Box
                    py={2}
                    px={3}
                >
                    <Typography
                        variant="h3"
                        color="text.accent"
                        data-testid="confirm-modal-title"
                    >
                        {title}
                    </Typography>
                </Box>
                <Box
                    px={3}
                    pb={2.5}
                    sx={{
                        maxHeight: '90%',
                        overflow: 'auto',
                    }}
                    data-testid="confirm-modal-message-box"
                >
                    {typeof message === 'string' && (
                        <Typography
                            variant="body1"
                            color="grey.300"
                            data-testid="confirm-modal-message"
                        >
                            {message}
                        </Typography>
                    )}
                    {typeof message !== 'string' && <>{message}</>}
                </Box>
                <Box
                    px={3}
                    pt={0}
                    pb={2}
                    gap={1}
                    display="flex"
                    justifyContent="space-between"
                >
                    {buttons && buttons.length > 0 && (
                        <Box
                            display="flex"
                            gap={1}
                            justifyContent="flex-start"
                        >
                            {buttons.map((button) => (
                                <Tooltip
                                    key={button.label}
                                    title={button.tooltip}
                                    arrow
                                    placement="top"
                                >
                                    <span>
                                        <LoadingButton
                                            variant={button.variant}
                                            data-testid={button.testId}
                                            color={button.color || 'primary'}
                                            sx={{
                                                width: 'fit-content',
                                                ...button.btnStyles,
                                            }}
                                            onClick={button.onClick}
                                            disabled={button.disabled}
                                            loadingPosition="end"
                                            loading={button.isLoading}
                                            endIcon={
                                                <Icon.Download size="1rem" />
                                            }
                                        >
                                            {button.label}
                                        </LoadingButton>
                                    </span>
                                </Tooltip>
                            ))}
                        </Box>
                    )}
                    <Box
                        display="flex"
                        gap={1}
                        justifyContent="flex-end"
                        flex={1}
                    >
                        {cancelLabel && onCancel && (
                            <Button
                                variant="outlined"
                                disabled={isLoading}
                                onClick={onCancel}
                                data-testid="confirm-modal-button-cancel"
                            >
                                {cancelLabel}
                            </Button>
                        )}

                        {confirmLabel && (
                            <LoadingButton
                                variant="contained"
                                onClick={onConfirm}
                                color="secondary"
                                disabled={isDisabled}
                                loading={isLoading}
                                data-testid="confirm-modal-button-confirm"
                            >
                                {confirmLabel}
                            </LoadingButton>
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};
