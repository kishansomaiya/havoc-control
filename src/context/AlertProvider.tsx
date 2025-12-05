import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Alert, Box, Snackbar } from '@mui/material';

const AUTO_HIDE_DURATION = 5000;
type AlertType = 'success' | 'info' | 'warning' | 'error';

interface IAlert {
    message: string;
    type: AlertType;
}
export const AlertContext = createContext<IAlert[]>([]);
export const useAlertContext = (): IAlert[] => {
    return useContext<IAlert[]>(AlertContext);
};

export const AddAlert = createContext<
    (message: string, type: AlertType) => void
>(() => {});
export const useAddAlert = () => {
    return useContext<(message: string, type: AlertType) => void>(AddAlert);
};

const AlertItem = ({
    alert,
    handleClose,
}: {
    alert: IAlert;
    handleClose: (alert: IAlert) => void;
}) => {
    const onClose = useCallback(() => {
        handleClose(alert);
    }, [handleClose, alert]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            onClose();
        }, AUTO_HIDE_DURATION);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [onClose]);

    return (
        <Alert
            key={`${alert.message}-${alert.type}`}
            onClose={onClose}
            severity={alert.type}
            sx={{ width: '100%' }}
        >
            {alert.message}
        </Alert>
    );
};

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<IAlert[]>([]);

    const handleAddAlert = useCallback((message: string, type: AlertType) => {
        setAlerts((alerts) => [
            ...alerts,
            {
                message,
                type,
            },
        ]);
    }, []);

    const handleClose = useCallback((alert: IAlert) => {
        setAlerts((alerts) => alerts.filter((item) => item !== alert));
    }, []);

    return (
        <AlertContext.Provider value={alerts}>
            <AddAlert.Provider value={handleAddAlert}>
                {children}
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={alerts.length > 0}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                    >
                        {alerts.map((alert) => (
                            <AlertItem
                                key={`${alert.message}-${alert.type}`}
                                alert={alert}
                                handleClose={handleClose}
                            />
                        ))}
                    </Box>
                </Snackbar>
            </AddAlert.Provider>
        </AlertContext.Provider>
    );
};
