import { renderHook } from '@testing-library/react';
import { useInitialFormValues } from './useInitialFormValues';
import { AnalysisType } from '../types/analysisTypeEnum';
import { DataVersion, EIVersion } from '../../../types';

describe('useInitialFormValues', () => {
    it('returns undefined until required inputs provided', () => {
        const { result } = renderHook(() =>
            useInitialFormValues({
                name: undefined,
                category: null,
                dataVersion: undefined,
                changeAnalysisType: true,
            })
        );
        expect(result.current.initialFormValues).toBeUndefined();
    });

    it('builds initial values when all inputs provided', () => {
        const { result } = renderHook(() =>
            useInitialFormValues({
                name: 'P1',
                locationCount: 2,
                category: { id: '1', label: 'Cat' },
                dataVersion: DataVersion.v3_2_0,
                eiVersion: EIVersion.v3_2_0,
                changeAnalysisType: true,
                isMockPortfolio: true,
                runDisclosureAnalysis: true,
            })
        );
        const v = result.current.initialFormValues!;
        expect(v.name).toBe('P1');
        expect(v.type).toBe(AnalysisType.PerilsAndScores);
        expect(v.custom).toBeDefined();
        expect(v.changeAnalysisType).toBe(true);
        expect(v.runDisclosureAnalysis).toBe(true);
    });

    it('sets defaults when optional inputs omitted', () => {
        const { result } = renderHook(() =>
            useInitialFormValues({
                name: 'P2',
                category: { id: '2', label: 'Cat2' },
                dataVersion: DataVersion.v3_2_0,
                changeAnalysisType: false,
            })
        );
        const v = result.current.initialFormValues!;
        expect(v.locationCount).toBe(0);
        expect(v.runDisclosureAnalysis).toBe(false);
        expect(v.isMockPortfolio).toBe(false);
    });
});
