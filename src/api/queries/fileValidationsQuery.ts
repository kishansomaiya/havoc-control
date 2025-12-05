import { useQuery } from '@tanstack/react-query';
import { FileValidationLocations } from '../openapi/auto-generated';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';

export const useFileValidationLocationsQuery = (params: {
    fileValidationId: string | undefined;
}) => {
    const { fileValidationsApi } = useApi();
    const {
        data,
        isLoading: isLocationsLoading,
        isError: isLocationsError,
        refetch: reFetchLocations,
    } = useQuery({
        queryKey: ['fileValidationLocations', params.fileValidationId],
        queryFn: ({ signal }): Promise<FileValidationLocations> => {
            const { fileValidationId } = params;
            if (fileValidationId === undefined) {
                throw new Error('Missed fileValidationId.');
            }
            return fileValidationsApi.retrieveFileValidationLocationsFileValidationsFileValidationIdLocationsGet(
                { fileValidationId },
                { signal }
            );
        },
        enabled: !!params.fileValidationId,
    });

    const locations = useMemo(() => data?.locations || [], [data]);

    return {
        locations,
        isLocationsLoading,
        isLocationsError,
        reFetchLocations,
    };
};
