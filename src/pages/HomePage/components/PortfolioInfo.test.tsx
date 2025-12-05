import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PortfolioInfo } from './PortfolioInfo';
import { IPortfolioItem } from '../../../types';

describe('PortfolioInfo', () => {
    const base = {
        id: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'u1',
        updatedBy: 'u1',
        pipelines: [
            {
                id: 'pl1',
                status: 'completed',
                errors: [],
                createdAt: new Date(),
                perilsResultSetId: 'p',
                scoresResultSetId: 's',
                impactsResultSetId: 'e',
            },
        ],
        resultSets: [
            { id: 'p', options: { perilsOptions: {} } },
            { id: 's', options: {} },
            { id: 'e', options: { perilsOptions: {}, defaults: {} } },
        ],
    } as unknown as IPortfolioItem;

    it('renders perils, scores, and economic impacts sections with data', () => {
        render(<PortfolioInfo portfolio={base} />);
        const perils = screen.getByTestId('portfolio-details-params-perils');
        const scores = screen.getByTestId('portfolio-details-params-scores');
        const econ = screen.getByTestId(
            'portfolio-details-params-economic-impact'
        );
        expect(
            within(perils).getByTestId('portfolio-details-params-perils-title')
        ).toBeInTheDocument();
        expect(
            within(scores).getByTestId('portfolio-details-params-scores-title')
        ).toBeInTheDocument();
        expect(
            within(econ).getByTestId(
                'portfolio-details-params-economic-impact-title'
            )
        ).toBeInTheDocument();
    });

    it('falls back to perils result set when EI perils are missing', () => {
        const portfolio = {
            ...base,
            pipelines: base.pipelines
                ? [
                      {
                          ...base.pipelines[0],
                          impactsResultSetId: undefined,
                      },
                  ]
                : [],
            resultSets: [
                { id: 'p', options: { perilsOptions: {} } },
                { id: 's', options: {} },
            ],
        } as unknown as IPortfolioItem;
        render(<PortfolioInfo portfolio={portfolio} />);
        const perils = screen.getByTestId('portfolio-details-params-perils');
        expect(
            within(perils).getByTestId('portfolio-details-params-perils-title')
        ).toBeInTheDocument();
    });

    it('renders with nulls when no matching result sets', () => {
        const portfolio = {
            ...base,
            pipelines: base.pipelines
                ? [
                      {
                          ...base.pipelines[0],
                          perilsResultSetId: 'x',
                          scoresResultSetId: 'y',
                          impactsResultSetId: 'z',
                      },
                  ]
                : [],
            resultSets: [
                { id: 'p2', options: {} },
                { id: 's2', options: {} },
            ],
        } as unknown as IPortfolioItem;
        render(<PortfolioInfo portfolio={portfolio} />);
        // Sections still render; values should fallback to "-" which we don't assert specifically here
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
});
