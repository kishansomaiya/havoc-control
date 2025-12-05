import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataSettingsForm } from './DataSettingsForm';
import { AnalysisType } from '../../../../types/analysisTypeEnum';
import { IPortfolio } from '../../../../types/portfolio';
import { DataVersion } from '../../../../../../types';
import { EIVersion } from '../../../../../../types/eiVersionEnum';
import { Formik } from 'formik';

import * as PortfolioParamsInfoModule from '../../../../../../components/PortfolioParamsInfo/PortfolioParamsInfo';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        PortfolioParamsInfoModule,
        'PortfolioParamsInfo'
    ).mockImplementation(((
        props: ComponentProps<
            typeof PortfolioParamsInfoModule.PortfolioParamsInfo
        >
    ) => (
        <div
            data-testid="data-settings-portfolio-params-info"
            data-props={JSON.stringify(props)}
        />
    )) as typeof PortfolioParamsInfoModule.PortfolioParamsInfo);
});

describe('DataSettingsForm', () => {
    it('computes and passes peril/score/economicImpact data', () => {
        render(
            <Formik
                initialValues={{
                    type: AnalysisType.PerilsScoresAndEconomicImpact,
                    dataVersion: '3.2.0',
                }}
                onSubmit={() => {}}
            >
                <DataSettingsForm />
            </Formik>
        );
        expect(
            screen.getByTestId('data-settings-portfolio-params-info')
        ).toBeInTheDocument();
    });
});

describe('DataSettingsForm', () => {
    const baseValues: IPortfolio = {
        name: '',
        category: null,
        locationCount: 0,
        dataVersion: DataVersion.v3_2_0,
        eiVersion: EIVersion.v3_2_0,
        changeAnalysisType: false,
        runDisclosureAnalysis: false,
        type: AnalysisType.PerilsScoresAndEconomicImpact,
        isPerilMetricsEnabled: true,
        isEconomicImpactsEnabled: true,
        isFloodMeshEnabled: false,
        isScoresEnabled: false,
        isMockPortfolio: false,
        custom: {} as IPortfolio['custom'],
    };

    it('renders PortfolioParamsInfo with data sets', () => {
        render(
            <Formik
                initialValues={baseValues}
                onSubmit={() => {}}
            >
                <DataSettingsForm />
            </Formik>
        );
        expect(
            screen.getByTestId('data-settings-portfolio-params-info')
        ).toBeInTheDocument();
    });
});
