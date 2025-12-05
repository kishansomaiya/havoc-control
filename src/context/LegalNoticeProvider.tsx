import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';

const ACKNOWLEDGED_DEFAULT_VALUE = false;
const LEGAL_ACKNOWLEDGE_KEY = 'legalAcknowledged';
const LEGAL_ACKNOWLEDGE_VALUE = 'ACCEPTED';

export const LegalNoticeContext = createContext<boolean>(
    ACKNOWLEDGED_DEFAULT_VALUE
);
export const useLegalNotice = (): boolean => {
    return useContext<boolean>(LegalNoticeContext);
};

export const UpdateLegalNoticeContext = createContext<
    (acknowledged: boolean) => void
>(() => {});
export const useLegalNoticeUpdate = () => {
    return useContext<(acknowledged: boolean) => void>(
        UpdateLegalNoticeContext
    );
};

export const LegalNoticeProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const acknowledgedInitialValue =
        localStorage.getItem(LEGAL_ACKNOWLEDGE_KEY) ===
            LEGAL_ACKNOWLEDGE_VALUE || ACKNOWLEDGED_DEFAULT_VALUE;
    const [acknowledged, setAcknowledged] = useState<boolean>(
        acknowledgedInitialValue
    );

    const handleAcknowledgedChanges = useCallback(
        (isAcknowledged: boolean) => {
            localStorage.setItem(
                LEGAL_ACKNOWLEDGE_KEY,
                LEGAL_ACKNOWLEDGE_VALUE
            );
            setAcknowledged(isAcknowledged);
        },
        [setAcknowledged]
    );

    return (
        <LegalNoticeContext.Provider value={acknowledged}>
            <UpdateLegalNoticeContext.Provider
                value={handleAcknowledgedChanges}
            >
                {children}
            </UpdateLegalNoticeContext.Provider>
        </LegalNoticeContext.Provider>
    );
};
