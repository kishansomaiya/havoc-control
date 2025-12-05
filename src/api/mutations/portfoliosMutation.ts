import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import {
    APIFilePurpose,
    APIFileType,
    APIOutputStyle,
    APIStatus,
} from '../../types';
import {
    CreateExportInput,
    CreatePortfolioInput,
    CreateSingleLocationReportInput,
    DisclosureResultSetOptions,
    ExportsApi,
    FileLinkResponse,
    FilesApi,
    MeshResultSetOptions,
    PortfolioSharingInput,
    RunPipelineRequest,
    UpdatePortfolioInput,
} from '../openapi/auto-generated';
import { useCallback, useRef } from 'react';
import { waitForPortfolioPipeline, waitForPortfolio } from './util/portfolio';
import { useAddAlert } from '../../context/AlertProvider';
import { downloadFile } from '../../utils';

const getFileLinks = async ({
    exportsApi,
    filesApi,
    exportInput,
    purpose,
}: {
    exportsApi: ExportsApi;
    filesApi: FilesApi;
    exportInput: CreateExportInput;
    purpose: APIFilePurpose;
}): Promise<FileLinkResponse[]> => {
    const data = await exportsApi.createExportExportsPost({
        createExportInput: exportInput,
    });

    let apiExport = data;
    while (apiExport.status === APIStatus.Pending) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const data = await exportsApi.retrieveExportExportsExportIdGet({
            exportId: apiExport.id,
        });

        apiExport = data;
    }

    if (apiExport.status === APIStatus.Failed) {
        throw new Error('Export failed.');
    }

    const { files } = apiExport;

    const filteredFiles = (files || []).filter(
        (file) => file.purpose === purpose
    );

    return Promise.all(
        filteredFiles.map(
            async (file) =>
                await filesApi.createFileDownloadLinkFilesFileIdLinksPost({
                    fileId: file.id,
                    createFileLinkInput: {
                        expiresIn: 3600,
                    },
                })
        )
    );
};

export const useDownloadPortfolioMutation = () => {
    const { exportsApi, filesApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (id: string) => {
            if (id === undefined) {
                throw new Error('Portfolio ID is required');
            }

            const data = await getFileLinks({
                exportsApi,
                filesApi,
                exportInput: {
                    fileType: APIFileType.CSV,
                    objectId: id,
                    options: {
                        objectType: 'portfolio',
                    },
                },
                purpose: APIFilePurpose.PortfolioExport,
            });

            return data;
        },
    });
    return {
        downloadPortfolio: mutateAsync,
        isPortfolioDownloading: isPending,
        isPortfolioDownloadError: isError,
        downloadPortfolioError: error,
    };
};

export const useDownloadPortfolioGeocodeLogMutation = () => {
    const { exportsApi, filesApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (id: string) => {
            if (id === undefined) {
                throw new Error('Portfolio ID is required');
            }

            const data = await getFileLinks({
                exportsApi,
                filesApi,
                exportInput: {
                    fileType: APIFileType.CSV,
                    objectId: id,
                    options: {
                        objectType: 'portfolio',
                    },
                },
                purpose: APIFilePurpose.GeocodeLog,
            });

            return data;
        },
    });
    return {
        downloadPortfolioGeocodeLog: mutateAsync,
        isPortfolioGeocodeLogDownloading: isPending,
        isPortfolioGeocodeLogDownloadError: isError,
        downloadPortfolioGeocodeLogError: error,
    };
};

export const useDeletePortfolioMutation = () => {
    const { portfoliosApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (id: string) => {
            if (id === undefined) {
                return undefined;
            }

            return await portfoliosApi.deletePortfolioPortfoliosPortfolioIdDelete(
                {
                    portfolioId: id,
                }
            );
        },
    });
    return {
        deletePortfolio: mutateAsync,
        isPortfolioDeleting: isPending,
        isPortfolioDeleteError: isError,
        deletePortfolioError: error,
    };
};

export const useUnShareSelfPortfolioMutation = () => {
    const { portfoliosApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (id: string) => {
            if (id === undefined) {
                throw new Error('Portfolio ID is required');
            }

            return await portfoliosApi.unsharePortfolioSelfPortfoliosPortfolioIdUnshareSelfGet(
                {
                    portfolioId: id,
                }
            );
        },
    });
    return {
        unshareSelfPortfolio: mutateAsync,
        isUnshareSelfPortfolioLoading: isPending,
        isUnshareSelfPortfolioError: isError,
        unsharePortfolioError: error,
    };
};

export const useDownloadPortfolioResultSetMutation = () => {
    const { exportsApi, filesApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            id,
            isStandard,
        }: {
            id: string;
            isStandard: boolean;
        }) => {
            if (id === undefined) {
                throw new Error('Result Set ID is required');
            }

            const data = await getFileLinks({
                exportsApi,
                filesApi,
                exportInput: {
                    fileType: APIFileType.CSV,
                    objectId: id,
                    options: {
                        objectType: 'result_set',
                        includeTiers: true,
                        includeBands: true,
                        includeMonthly: true,
                        includePeakGust: false,
                    },
                    outputStyle: isStandard
                        ? APIOutputStyle.Standard
                        : APIOutputStyle.Enhanced,
                },
                purpose: APIFilePurpose.ResultSetExport,
            });

            return data;
        },
    });
    return {
        downloadPortfolioResultSet: mutateAsync,
        isPortfolioResultSetDownloading: isPending,
        isPortfolioResultSetDownloadError: isError,
        downloadPortfolioResultSetError: error,
    };
};

export const useDownloadPortfolioSLRMutation = () => {
    const { singleLocationReportApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (
            createSingleLocationReportInput: CreateSingleLocationReportInput
        ) => {
            try {
                const apiSLRData =
                    await singleLocationReportApi.generateSingleLocationReportStatelessSlrGeneratePost(
                        {
                            createSingleLocationReportInput,
                        }
                    );
                return apiSLRData;
            } catch (err) {
                console.log('err', err);
                throw err;
            }
        },
    });

    return {
        downloadPortfolioSLR: mutateAsync,
        isPortfolioSLRDownloading: isPending,
        isPortfolioSLRError: isError,
        downloadPortfolioSLRError: error,
    };
};

export const useDownloadSLRFilesMutation = () => {
    const { singleLocationReportApi } = useApi();
    const addAlert = useAddAlert();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (
            files: Array<{ fileId: string; filename: string }>
        ) => {
            try {
                for (const file of files) {
                    const blob =
                        await singleLocationReportApi.downloadStatelessSlrFileSlrDownloadFileIdGet(
                            { fileId: file.fileId }
                        );
                    const downloadURL = URL.createObjectURL(blob);
                    downloadFile(downloadURL, file.filename);
                    URL.revokeObjectURL(downloadURL);
                }
            } catch (err) {
                addAlert(
                    'Encountered error while downloading SLR files, please try again.',
                    'error'
                );
                throw err;
            }
        },
    });
    return {
        downloadSLRFiles: mutateAsync,
        isSLRFilesDownloading: isPending,
        isSLRFilesDownloadError: isError,
        downloadSLRFilesError: error,
    };
};

export const useCreatePortfolioGeocodeMutation = () => {
    const { appApi } = useApi();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            enteredAddressLocations: locationGeocodeRequestInput,
        }: {
            enteredAddressLocations: any;
        }) => {
            abortControllerRef.current = new AbortController();

            const createPortfolioGeocodeApiResponse =
                await appApi.locationGeocodeAppGeocodePost(
                    {
                        locationGeocodeRequestInput,
                    },
                    { signal: abortControllerRef.current.signal }
                );

            return createPortfolioGeocodeApiResponse;
        },
    });

    const cancelGeocodeValidation = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        createPortfolioGeocode: mutateAsync,
        isPortfolioGeocodeCreating: isPending,
        isPortfolioGeocodeError: isError,
        createPortfolioGeocodeError: error,
        cancelGeocodeValidation,
        abortControllerRef,
    };
};

export const useSharePortfolioMutation = () => {
    const { portfoliosApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            id,
            portfolioSharingInputBody,
        }: {
            id: string;
            portfolioSharingInputBody: PortfolioSharingInput;
        }) => {
            if (id === undefined) {
                throw new Error('Portfolio ID is required');
            }

            return await portfoliosApi.sharePortfolioPortfoliosPortfolioIdSharePost(
                {
                    portfolioId: id,
                    portfolioSharingInput: portfolioSharingInputBody,
                }
            );
        },
    });
    return {
        sharePortfolio: mutateAsync,
        isPortfolioShareLoading: isPending,
        isPortfolioShareError: isError,
        sharePortfolioError: error,
    };
};

export const useUnsharePortfolioMutation = () => {
    const { portfoliosApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            id,
            portfolioSharingInputBody,
        }: {
            id: string;
            portfolioSharingInputBody: PortfolioSharingInput;
        }) => {
            if (id === undefined) {
                throw new Error('Portfolio ID is required');
            }

            return await portfoliosApi.unsharePortfolioPortfoliosPortfolioIdUnsharePost(
                {
                    portfolioId: id,
                    portfolioSharingInput: portfolioSharingInputBody,
                }
            );
        },
    });
    return {
        unsharePortfolio: mutateAsync,
        isPortfolioUnshareLoading: isPending,
        isPortfolioUnshareError: isError,
        unsharePortfolioError: error,
    };
};

export const useCreatePortfolioWithResultSetsMutation = () => {
    const queryClient = useQueryClient();
    const { portfoliosApi, appApi } = useApi();
    const addAlert = useAddAlert();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            portfolio: createPortfolioInput,
            pipeline: runPipelineRequest,
        }: {
            portfolio: CreatePortfolioInput;
            pipeline?: RunPipelineRequest;
        }) => {
            abortControllerRef.current = new AbortController();

            const createPortfolioApiResponse =
                await portfoliosApi.createPortfolioPortfoliosPost(
                    {
                        createPortfolioInput,
                    },
                    { signal: abortControllerRef.current.signal }
                );

            const apiPortfolio = await waitForPortfolio(
                createPortfolioApiResponse,
                portfoliosApi,
                abortControllerRef.current
            );

            try {
                if (
                    runPipelineRequest &&
                    !abortControllerRef.current.signal.aborted
                ) {
                    const apiPortfolioPipeline =
                        await appApi.appRunPipelineAppRunPost(
                            {
                                runPipelineRequest: {
                                    ...runPipelineRequest,
                                    portfolioId: apiPortfolio.id,
                                },
                            },
                            { signal: abortControllerRef.current.signal }
                        );

                    await waitForPortfolioPipeline(
                        apiPortfolioPipeline,
                        appApi,
                        abortControllerRef.current
                    );
                }
            } catch (error) {
                addAlert(
                    'Analysis data was not created. Please edit the portfolio and re-run analysis data.',
                    'warning'
                );
            }

            return apiPortfolio;
        },
        onSettled: () => {
            queryClient.removeQueries({
                queryKey: ['portfolios'],
            });
        },
    });

    const cancelCreatePortfolio = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        createPortfolio: mutateAsync,
        isPortfolioCreating: isPending,
        isPortfolioCreateError: isError,
        createPortfolioError: error,
        cancelCreatePortfolio,
        abortControllerRef,
    };
};

export const useUpdatePortfolioWithResultSetsMutation = () => {
    const queryClient = useQueryClient();
    const { portfoliosApi, appApi } = useApi();
    const addAlert = useAddAlert();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            portfolioId,
            portfolio,
            pipeline: runPipelineRequest,
        }: {
            portfolioId: string;
            portfolio: UpdatePortfolioInput;
            pipeline?: RunPipelineRequest;
        }) => {
            abortControllerRef.current = new AbortController();

            const updatePortfolioApiResponse =
                await portfoliosApi.updatePortfolioPortfoliosPortfolioIdPut(
                    {
                        portfolioId,
                        updatePortfolioInput: portfolio,
                    },
                    { signal: abortControllerRef.current.signal }
                );

            const apiPortfolio = await waitForPortfolio(
                updatePortfolioApiResponse,
                portfoliosApi,
                abortControllerRef.current
            );

            try {
                if (
                    runPipelineRequest &&
                    !abortControllerRef.current.signal.aborted
                ) {
                    const apiPortfolioPipeline =
                        await appApi.appRunPipelineAppRunPost(
                            {
                                runPipelineRequest: {
                                    ...runPipelineRequest,
                                    portfolioId: apiPortfolio.id,
                                },
                            },
                            { signal: abortControllerRef.current.signal }
                        );

                    await waitForPortfolioPipeline(
                        apiPortfolioPipeline,
                        appApi,
                        abortControllerRef.current
                    );
                }
            } catch (error) {
                addAlert(
                    'Analysis data was not created. Please edit the portfolio and re-run analysis data.',
                    'warning'
                );
            }

            return apiPortfolio;
        },
        onSettled: (_data, _error, { portfolioId }) => {
            queryClient.removeQueries({
                queryKey: ['portfolios'],
            });
            queryClient.removeQueries({
                queryKey: ['portfolios', portfolioId],
            });
            queryClient.removeQueries({
                queryKey: ['resultSets', portfolioId],
            });
        },
    });

    const cancelUpdatePortfolio = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        updatePortfolio: mutateAsync,
        isPortfolioUpdating: isPending,
        isPortfolioUpdateError: isError,
        updatePortfolioError: error,
        cancelUpdatePortfolio,
        abortControllerRef,
    };
};

export const useCreatePortfolioFloodMeshResultSetMutation = () => {
    const queryClient = useQueryClient();
    const { appApi } = useApi();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            portfolioId,
            pipelineId,
            meshResultSetOptions,
        }: {
            portfolioId: string;
            pipelineId: string;
            meshResultSetOptions: MeshResultSetOptions;
        }) => {
            abortControllerRef.current = new AbortController();

            const apiPortfolioMeshResultSet =
                await appApi.appPipelineAppendMeshAppRunPipelineIdMeshPost(
                    {
                        pipelineId,
                        meshResultSetOptions,
                    },
                    { signal: abortControllerRef.current.signal }
                );

            await queryClient.refetchQueries({
                queryKey: ['portfolios', portfolioId],
            });
            await queryClient.refetchQueries({
                queryKey: ['resultSets', portfolioId],
            });
            return apiPortfolioMeshResultSet;
        },
        onSettled: async (_data, _error, { portfolioId }) => {
            await queryClient.refetchQueries({
                queryKey: ['portfolios', portfolioId],
            });
            await queryClient.refetchQueries({
                queryKey: ['resultSets', portfolioId],
            });
        },
    });

    const cancelCreatePortfolioFloodMeshResultSet = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        createPortfolioFloodMeshResultSet: mutateAsync,
        isPortfolioFloodMeshResultSetCreating: isPending,
        isPortfolioFloodMeshResultSetCreateError: isError,
        createPortfolioFloodMeshResultSetError: error,
        cancelCreatePortfolioFloodMeshResultSet,
        abortControllerRef,
    };
};

export const useCreatePortfolioDisclosureResultSetMutation = () => {
    const queryClient = useQueryClient();
    const { appApi } = useApi();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            portfolioId,
            pipelineId,
            disclosureResultSetOptions = {
                dataVersion: '3.2.0',
            },
        }: {
            portfolioId: string;
            pipelineId: string;
            disclosureResultSetOptions?: DisclosureResultSetOptions;
        }) => {
            abortControllerRef.current = new AbortController();

            const apiPortfolioDisclosureResultSet =
                await appApi.appPipelineAppendDisclosureAppRunPipelineIdDisclosurePost(
                    {
                        pipelineId,
                        body: {
                            disclosure_result_set_options:
                                disclosureResultSetOptions,
                        },
                    },
                    { signal: abortControllerRef.current.signal }
                );

            await queryClient.refetchQueries({
                queryKey: ['portfolios', portfolioId],
            });
            await queryClient.refetchQueries({
                queryKey: ['resultSets', portfolioId],
            });
            return apiPortfolioDisclosureResultSet;
        },
        onSettled: async (_data, _error, { portfolioId }) => {
            await queryClient.refetchQueries({
                queryKey: ['portfolios', portfolioId],
            });
            await queryClient.refetchQueries({
                queryKey: ['resultSets', portfolioId],
            });
        },
    });

    const cancelCreatePortfolioDisclosureResultSet = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        createPortfolioDisclosureResultSet: mutateAsync,
        isPortfolioDisclosureResultSetCreating: isPending,
        isPortfolioDisclosureResultSetCreateError: isError,
        createPortfolioDisclosureResultSetError: error,
        cancelCreatePortfolioDisclosureResultSet,
        abortControllerRef,
    };
};
