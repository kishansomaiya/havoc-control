import { useMutation } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { downloadFile } from '../../utils';
import { useAddAlert } from '../../context/AlertProvider';

export const useDownloadMaterialityWorkbookMutation = () => {
    const { appApi } = useApi();
    const addAlert = useAddAlert();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async () => {
            try {
                const blob =
                    await appApi.getMaterialityWorkbookAppMaterialityWorkbookGet();
                const downloadURL = URL.createObjectURL(blob);

                downloadFile(downloadURL, 'materiality-workbook.xlsm');

                URL.revokeObjectURL(downloadURL);
            } catch (error) {
                addAlert(
                    'Encountered error while downloading Materiality Workbook, please try again.',
                    'error'
                );
            }
        },
    });
    return {
        downloadMaterialityWorkbook: mutateAsync,
        isMaterialityWorkbookDownloading: isPending,
        isMaterialityWorkbookDownloadError: isError,
        downloadMaterialityWorkbookError: error,
    };
};

export const useDownloadCSRDUserDocumentationMutation = () => {
    const { appApi } = useApi();
    const addAlert = useAddAlert();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async () => {
            try {
                const blob =
                    await appApi.getCsrdDocumentationAppCsrdDocumentationGet();
                const downloadURL = URL.createObjectURL(blob);

                downloadFile(downloadURL, 'CSRD User Documentation.zip');

                URL.revokeObjectURL(downloadURL);
            } catch (error) {
                addAlert(
                    'Encountered error while downloading CSRD User Documentation, please try again.',
                    'error'
                );
            }
        },
    });
    return {
        downloadCSRDUserDocumentation: mutateAsync,
        isCSRDUserDocumentationDownloading: isPending,
        isCSRDUserDocumentationDownloadError: isError,
        downloadCSRDUserDocumentationError: error,
    };
};
