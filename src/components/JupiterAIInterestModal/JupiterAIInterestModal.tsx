import { ComponentProps, FC, useCallback, useState } from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

type ExcludedProps = 'open' | 'children';

const JUPITER_AI_INTEREST_FORM_LINK =
    'https://www2.jupiterintel.com/l/972403/2024-05-14/5y2pr';

interface JupiterAIInterestModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    onClose: () => void;
}

export const JupiterAIInterestModal: FC<JupiterAIInterestModalProps> = ({
    onClose,
    ...props
}) => {
    const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

    const handleIframeOnLoad = useCallback(() => {
        setIsIframeLoaded(true);
    }, []);

    return (
        <ConfirmModal
            isOpen
            title="I'm interested in Jupiter AI"
            message={
                <Box>
                    {!isIframeLoaded && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '21.875rem',
                                width: '28.125rem',
                            }}
                        >
                            <CircularProgress color="inherit" />
                        </Box>
                    )}

                    <iframe
                        allowTransparency
                        src={JUPITER_AI_INTEREST_FORM_LINK}
                        title="AI Interest Form"
                        width="100%"
                        height={isIframeLoaded ? 350 : 0}
                        style={{
                            border: 0,
                            background: 'transparent',
                            minWidth: '28.125rem',
                            paddingTop: 0,
                        }}
                        onLoad={handleIframeOnLoad}
                    />
                </Box>
            }
            cancelLabel=""
            confirmLabel=""
            onCancel={onClose}
            {...props}
        />
    );
};
