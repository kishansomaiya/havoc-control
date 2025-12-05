import { Box, Button, Typography } from '@mui/material';
import { useFormatMessage } from '../../localization/useFormatMessage';

export type TeaserProps = {
    titleText: string;
    bodyText: string;
    closeText?: string;
    proceedText?: string;
    subtitleText?: string;
    onClose?: () => void;
    onProceed?: () => void;
    disableOnProceed?: boolean;
    dismiss?: boolean;
};

const LOCK_ICON_PATH = '/lock-icon.svg';

export function TeaserPopup({
    titleText,
    bodyText,
    closeText,
    proceedText,
    subtitleText,
    onClose,
    onProceed,
    disableOnProceed,
    dismiss = false,
}: TeaserProps) {
    const formatMessage = useFormatMessage();
    return (
        <Box
            sx={{
                backgroundColor: 'rgba(36,36,36, 0.65)',
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {!dismiss ? (
                <Box
                    sx={{
                        backgroundColor: (theme) => theme.palette.grey[600],
                        width: '600px',
                        padding: '16px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        borderRadius: '4px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '24px',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography typography={'h3'}>{titleText}</Typography>
                        <Typography typography={'body1'}>{bodyText}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'end',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                gap: '16px',
                            }}
                        >
                            {onClose ? (
                                <Button
                                    variant="outlined"
                                    onClick={onClose}
                                >
                                    {closeText}
                                </Button>
                            ) : null}
                            {onProceed ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={onProceed}
                                    disabled={disableOnProceed}
                                >
                                    {proceedText}
                                </Button>
                            ) : null}
                        </Box>
                        {subtitleText && (
                            <Typography typography={'subtitle2'}>
                                {subtitleText}
                            </Typography>
                        )}
                    </Box>
                </Box>
            ) : (
                <img
                    src={LOCK_ICON_PATH}
                    alt={formatMessage('adaptation.teaser.lock.alt')}
                />
            )}
        </Box>
    );
}
