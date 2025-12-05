import { renderHook } from '@testing-library/react';
import {
    usePortfolioEIVersion,
    defaultEIVersion,
} from './usePortfolioEIVersion';
import {
    PortfolioResponse,
    ResultSetResponse,
} from '../../../api/openapi/auto-generated';
import * as utils from '../../../utils';
import * as typesModule from '../../../types';

vi.mock('@auth0/auth0-react', async () => {
    const actual =
        await vi.importActual<typeof import('@auth0/auth0-react')>(
            '@auth0/auth0-react'
        );
    return {
        ...actual,
        useAuth0: () => ({ user: { 'custom:jupiter-roles': [] } }),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(utils, 'checkIsUserCanAccessEI_3_1_1').mockReturnValue(false);
    vi.spyOn(typesModule, 'getEIToDataVersionMap').mockReturnValue(
        {} as ReturnType<typeof typesModule.getEIToDataVersionMap>
    );
});

describe('usePortfolioEIVersion', () => {
    it('returns undefined while loading or when portfolio missing', () => {
        const { result: r1 } = renderHook(() =>
            usePortfolioEIVersion({
                portfolio: undefined,
                resultSets: [],
                isResultSetsLoading: true,
            })
        );
        expect(r1.current).toBeUndefined();

        const { result: r2 } = renderHook(() =>
            usePortfolioEIVersion({
                portfolio: undefined as unknown as PortfolioResponse,
                resultSets: [],
                isResultSetsLoading: false,
            })
        );
        expect(r2.current).toBeUndefined();
    });

    it('falls back to default when no EI version or mapping present', () => {
        const { result } = renderHook(() =>
            usePortfolioEIVersion({
                portfolio: { id: 1 } as unknown as PortfolioResponse,
                resultSets: [] as unknown as ResultSetResponse[],
                isResultSetsLoading: false,
            })
        );
        expect(result.current).toBe(defaultEIVersion);
    });
});
