import { downloadFileFromRawResponse } from '../../utils';
import { useApi } from '../helpers/useApiHook';
import { useMutation } from '@tanstack/react-query';

export const useTenantUserReportMutation = () => {
    const { usageExport } = useApi();

    return useMutation({
        mutationFn: async ({
            tenantId,
            startTime,
            endTime,
        }: {
            tenantId: string;
            startTime?: Date;
            endTime?: Date;
        }) => {
            return usageExport
                .getTenantUsersSummaryCSVRaw({
                    id: tenantId,
                    startTime,
                    endTime,
                })
                .then(downloadFileFromRawResponse);
        },
    });
};
