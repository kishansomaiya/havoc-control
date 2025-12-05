import { createContext, memo, useContext, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
    Configuration,
    LocationsApi,
    PortfoliosApi,
    ResultSetsApi,
    CategoriesApi,
    ExportsApi,
    FilesApi,
    FileValidationsApi,
    SingleLocationReportApi,
    AppApi,
    ChatApi,
    AdaptationApi,
} from '../openapi/auto-generated';
import { adminApiUrl, apiUrl, ioApiUrl } from '../../config';
import { adminApiConfig, apiConfig } from './config';
import { createQueryClient } from './queryClient';
import { ClientsApi } from '../iouserapi/apis/ClientsApi';
import { Doc360Api } from '../iouserapi/apis/Doc360Api';
import { FileValidationMessagesApi } from '../jupiterapi/apis/FileValidationMessagesApi';
import { NewFileValidationsApi } from '../jupiterapi/apis/NewFileValidationsApi';
import { NewResultSetsApi } from '../jupiterapi/apis/NewResultSetsApi';
import { useRefreshTokens } from '../../auth0/Auth0Guard';
import {
    UsageApi as UsageApiAdmin,
    RoleApi,
    Configuration as AdminConfiguration,
    UserApi,
    M2MClientApi,
    UsageExportApi,
} from '../openapi/auto-generated-admin';

interface RestApi {
    locationsApi: LocationsApi;
    portfoliosApi: PortfoliosApi;
    resultSetsApi: ResultSetsApi;
    categoriesApi: CategoriesApi;
    exportsApi: ExportsApi;
    filesApi: FilesApi;
    fileValidationsApi: FileValidationsApi;
    singleLocationReportApi: SingleLocationReportApi;
    usageApiAdmin: UsageApiAdmin;
    usageExport: UsageExportApi;
    clientsApi: ClientsApi;
    appApi: AppApi;
    doc360Api: Doc360Api;
    chatApi: ChatApi;
    newFileValidationsApi: NewFileValidationsApi;
    fileValidationMessagesApi: FileValidationMessagesApi;
    newResultSetsApi: NewResultSetsApi;
    roleApi: RoleApi;
    userApi: UserApi;
    m2mClient: M2MClientApi;
    adaptationApi: AdaptationApi;
}

const restApiWithConfig = (
    config: Configuration,
    ioConfig: Configuration,
    adminConfig: AdminConfiguration
): RestApi => ({
    locationsApi: new LocationsApi(config),
    portfoliosApi: new PortfoliosApi(config),
    resultSetsApi: new ResultSetsApi(config),
    categoriesApi: new CategoriesApi(config),
    exportsApi: new ExportsApi(config),
    filesApi: new FilesApi(config),
    fileValidationsApi: new FileValidationsApi(config),
    singleLocationReportApi: new SingleLocationReportApi(config),
    usageApiAdmin: new UsageApiAdmin(adminConfig),
    usageExport: new UsageExportApi(adminConfig),
    clientsApi: new ClientsApi(ioConfig),
    appApi: new AppApi(config),
    doc360Api: new Doc360Api(ioConfig),
    chatApi: new ChatApi(config),
    newFileValidationsApi: new NewFileValidationsApi(config),
    fileValidationMessagesApi: new FileValidationMessagesApi(config),
    newResultSetsApi: new NewResultSetsApi(config),
    roleApi: new RoleApi(adminConfig),
    userApi: new UserApi(adminConfig),
    m2mClient: new M2MClientApi(adminConfig),
    adaptationApi: new AdaptationApi(config),
});

const ApiProviderContext = createContext<RestApi>(
    restApiWithConfig(
        apiConfig(undefined),
        apiConfig(undefined),
        adminApiConfig(undefined)
    )
);
ApiProviderContext.displayName = 'ApiProviderContext';

export const useApi = (): RestApi => useContext(ApiProviderContext);

const queryClient = createQueryClient();

export interface ApiProviderProps {
    children?: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = memo(({ children }) => {
    const refreshTokens = useRefreshTokens();

    const { config, ioConfig, adminConfig } = useMemo(() => {
        const config = apiConfig(apiUrl, refreshTokens);
        const ioConfig = apiConfig(ioApiUrl, refreshTokens);
        const adminConfig = adminApiConfig(adminApiUrl, refreshTokens);

        return { config, ioConfig, adminConfig };
    }, [refreshTokens]);

    const restApi: RestApi = useMemo(
        () => restApiWithConfig(config, ioConfig, adminConfig),
        [config, ioConfig, adminConfig]
    );

    return (
        <ApiProviderContext.Provider value={restApi}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ApiProviderContext.Provider>
    );
});
