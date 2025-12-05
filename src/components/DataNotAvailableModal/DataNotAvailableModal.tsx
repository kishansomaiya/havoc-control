import { ComponentProps, FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Modal } from '@mui/material';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

type ExcludedProps = 'open' | 'children';

interface DataNotAvailableModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    defaultRoute: string;
    onClose: () => void;
}

export const DataNotAvailableModal: FC<DataNotAvailableModalProps> = ({
    defaultRoute,
    onClose,
    ...props
}) => {
    const navigate = useNavigate();
    const { key } = useLocation();

    const handleGoBack = useCallback(() => {
        onClose();
        if (key === 'default') {
            navigate(defaultRoute);
        } else {
            navigate(-1);
        }
    }, [key, navigate, defaultRoute, onClose]);

    return (
        <ConfirmModal
            isOpen
            title="Dashboard data is not available"
            message="Please generate required Analysis data for this portfolio to be able to see this dashboard"
            cancelLabel=""
            confirmLabel="Go Back"
            onConfirm={handleGoBack}
            {...props}
            data-testid="data-not-available-modal"
        />
    );
};
