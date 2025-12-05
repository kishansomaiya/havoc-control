import { render, screen } from '@testing-library/react';
import { PortfolioParamsInfo } from './PortfolioParamsInfo';
import { describe, it, expect } from 'vitest';
import {
    PerilsResultSetOptions,
    ScoresResultSetOptions,
} from '../../api/openapi/auto-generated';

describe('PortfolioParamsInfo', () => {
    it('renders with minimal props', () => {
        render(
            <PortfolioParamsInfo
                perilData={null}
                scoreData={null}
                economicImpactData={null}
            />
        );
        expect(
            screen.getByTestId('portfolio-details-params-perils')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-details-params-scores')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-details-params-economic-impact')
        ).toBeInTheDocument();
    });

    it('renders peril data when provided', () => {
        const perilData = {
            perils: ['flood'],
            scenarios: ['scenario1'],
            years: [2020, 2021],
            floodDefense: { enabled: true, zeroOutDefendedLocations: false },
        };
        render(
            <PortfolioParamsInfo
                perilData={perilData as PerilsResultSetOptions}
                scoreData={null}
                economicImpactData={null}
            />
        );
        expect(screen.getByText('Perils')).toBeInTheDocument();
        expect(screen.getByText('Scenarios')).toBeInTheDocument();
        expect(screen.getByText('Years')).toBeInTheDocument();
        expect(screen.getByText('Flood Defense Enabled')).toBeInTheDocument();
    });

    it('renders score data when provided', () => {
        const scoreData = {
            perils: ['score1'],
            includeBenchmarks: true,
            benchmarkLevels: ['level1'],
        };
        render(
            <PortfolioParamsInfo
                perilData={null}
                scoreData={scoreData as ScoresResultSetOptions}
                economicImpactData={null}
            />
        );
        expect(screen.getByText('Scores')).toBeInTheDocument();
        expect(screen.getByText('Benchmarking Enabled')).toBeInTheDocument();
        expect(screen.getByText('Levels')).toBeInTheDocument();
    });

    it('renders economic impact data when provided', () => {
        const economicImpactData = {
            waterShadowPriceRatio: 1.5,
            annualGrowth: 2.0,
            annualVolatility: 0.5,
            salesMargin: 0.3,
            discountRate: 0.1,
        };
        render(
            <PortfolioParamsInfo
                perilData={null}
                scoreData={null}
                economicImpactData={economicImpactData}
            />
        );
        expect(screen.getByText('Shadow Price Ratio')).toBeInTheDocument();
        expect(screen.getByText('Annual Growth Rate')).toBeInTheDocument();
        expect(screen.getByText('Annual Volatility Rate')).toBeInTheDocument();
        expect(screen.getByText('Sales Margin')).toBeInTheDocument();
        expect(screen.getByText('Discount Rate')).toBeInTheDocument();
    });
});
