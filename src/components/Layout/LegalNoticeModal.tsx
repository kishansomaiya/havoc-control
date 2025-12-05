import { ComponentProps, FC, useCallback } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { useLegalNoticeUpdate } from '../../context/LegalNoticeProvider';
import { useUserSession } from '../../context/SessionProvider';

interface LegalNoticeModalProps extends ComponentProps<typeof Box> {}

export const LegalNoticeModal: FC<LegalNoticeModalProps> = () => {
    const setLegalNoticeAcknowledged = useLegalNoticeUpdate();
    const { logoutAndClearSessions } = useUserSession();

    const handleConfirm = useCallback(() => {
        setLegalNoticeAcknowledged(true);
    }, [setLegalNoticeAcknowledged]);

    const handleLogout = useCallback(
        async (_: object, reason?: string) => {
            if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
                return;
            }
            await logoutAndClearSessions();
            localStorage.clear();
        },
        [logoutAndClearSessions]
    );

    return (
        <Box>
            <ConfirmModal
                title="Notice"
                data-testid="legal-notice-modal-title"
                disableAutoFocus={true}
                message={
                    <Box>
                        <Typography
                            variant="body1"
                            color="grey.300"
                            data-testid="legal-notice-modal-message"
                        >
                            I confirm that I am an authorized user of the
                            ClimateScore Global application and that I will use
                            the application solely in accordance with the terms
                            of my company's agreement with Jupiter, or the{' '}
                            <Link
                                href="https://cdn.prod.website-files.com/63727ffa52be207cf8bb4aca/680b85bc042aa23f51704625_On-line%20Trial%20Agreement%20(with%20platform%20access)%20April%202025.pdf"
                                target="_blank"
                                color="grey.300"
                                data-testid="legal-notice-modal-trial-agreement-link"
                            >
                                Trial Agreement
                            </Link>{' '}
                            (if this is a trial and no agreement has been
                            entered into between Jupiter and my company),
                            including the requirement to treat the app and the
                            Jupiter data accessed via the app as confidential
                            information of Jupiter. I also acknowledge and agree
                            to the{' '}
                            <Link
                                href="https://www.jupiterintel.com/legal/jupiters-acceptable-use-policy-for-jupiter-software-as-a-service"
                                target="_blank"
                                color="grey.300"
                                data-testid="legal-notice-modal-privacy-policy-link"
                            >
                                Jupiter Privacy Policy
                            </Link>{' '}
                            which governs Jupiter's treatment of my personal
                            information.
                        </Typography>
                    </Box>
                }
                onConfirm={handleConfirm}
                onCancel={handleLogout}
                confirmLabel="Confirm"
                cancelLabel="Log Out"
            />
        </Box>
    );
};
