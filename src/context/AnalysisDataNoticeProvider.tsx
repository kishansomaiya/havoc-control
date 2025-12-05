import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';

const DEFAULT_VALUE = false;
const ANALYSIS_DATA_NOTICE_VALUE = 'HIDDEN';
const ANALYSIS_DATA_NOTICE_KEY = 'noAnalysisData';

export const AnalysisDataNoticeContext = createContext<boolean>(DEFAULT_VALUE);
export const useAnalysisDataNotice = (): boolean => {
    return useContext<boolean>(AnalysisDataNoticeContext);
};

export const UpdateAnalysisDataNoticeContext = createContext<
    (hidden: boolean) => void
>(() => {});
export const useAnalysisDataNoticeUpdate = () => {
    return useContext<(hidden: boolean) => void>(
        UpdateAnalysisDataNoticeContext
    );
};

export const AnalysisDataNoticeProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const hiddenInitialValue =
        localStorage.getItem(ANALYSIS_DATA_NOTICE_KEY) ===
            ANALYSIS_DATA_NOTICE_VALUE || DEFAULT_VALUE;
    const [hidden, setHidden] = useState<boolean>(hiddenInitialValue);

    const handleHiddenChanges = useCallback((isHidden: boolean) => {
        localStorage.setItem(
            ANALYSIS_DATA_NOTICE_KEY,
            ANALYSIS_DATA_NOTICE_VALUE
        );
        setHidden(isHidden);
    }, []);

    return (
        <AnalysisDataNoticeContext.Provider value={hidden}>
            <UpdateAnalysisDataNoticeContext.Provider
                value={handleHiddenChanges}
            >
                {children}
            </UpdateAnalysisDataNoticeContext.Provider>
        </AnalysisDataNoticeContext.Provider>
    );
};
