import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';

export const useUserUsageQuery = ({
    userId,
    tenantId,
    startTime,
    endTime,
}: {
    userId: string;
    tenantId: string;
    startTime?: Date;
    endTime?: Date;
}) => {
    const { usageApiAdmin } = useApi();

    return useQuery({
        enabled: !!userId && !!tenantId,
        queryKey: ['userUsage', userId],
        queryFn: ({ signal }) => {
            return usageApiAdmin.getUserUsageSummary(
                { tenantId, userId, startTime, endTime },
                { signal }
            );
        },
    });
};

export const useTenantUsageQuery = ({
    tenantId,
    startTime,
    endTime,
}: {
    tenantId: string;
    startTime?: Date;
    endTime?: Date;
}) => {
    const { usageApiAdmin } = useApi();

    return useQuery({
        enabled: !!tenantId,
        queryKey: ['tenantUsage', tenantId],
        queryFn: ({ signal }) => {
            return usageApiAdmin.getTenantUsageSummary(
                { id: tenantId, startTime, endTime },
                { signal }
            );
        },
    });
};
