import {
    PortfolioResponse,
    ResultSetResponse,
} from '../api/openapi/auto-generated';

export interface IPortfolioItem extends PortfolioResponse {
    resultSets: ResultSetResponse[];
}
