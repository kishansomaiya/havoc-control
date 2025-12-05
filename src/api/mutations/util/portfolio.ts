import { APIStatus } from '../../../types';
import {
    AppApi,
    PortfolioPipelineResponse,
    PortfolioResponse,
    PortfoliosApi,
} from '../../openapi/auto-generated';

export async function waitForPortfolio(
    initialResponse: PortfolioResponse,
    portfoliosApi: PortfoliosApi,
    abortController: AbortController
): Promise<PortfolioResponse> {
    let apiPortfolio = initialResponse;
    while (
        apiPortfolio.status === APIStatus.Pending &&
        !abortController.signal.aborted
    ) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const data =
            await portfoliosApi.retrievePortfolioPortfoliosPortfolioIdGet(
                { portfolioId: apiPortfolio.id },
                { signal: abortController.signal }
            );
        apiPortfolio = data;
    }

    if (
        apiPortfolio.status === APIStatus.Failed ||
        abortController.signal.aborted
    ) {
        throw new Error('Create portfolio failed.');
    }

    return apiPortfolio;
}

export async function waitForPortfolioPipeline(
    initialResponse: PortfolioPipelineResponse,
    appApi: AppApi,
    abortController: AbortController
): Promise<void> {
    let apiPortfolioPipeline = initialResponse;
    while (
        !apiPortfolioPipeline.portfolioId &&
        !abortController.signal.aborted
    ) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const data = await appApi.appRetrievePipelineAppRunPipelineIdGet(
            { pipelineId: apiPortfolioPipeline.id },
            { signal: abortController.signal }
        );
        apiPortfolioPipeline = data;
    }

    if (
        apiPortfolioPipeline.status === APIStatus.Failed ||
        abortController.signal.aborted
    ) {
        throw new Error('Create portfolio pipeline failed.');
    }

    return;
}
