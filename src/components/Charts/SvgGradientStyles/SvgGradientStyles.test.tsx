import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SvgGradientStyles } from './SvgGradientStyles';
import type { CommonSeriesType } from '@mui/x-charts/internals';

describe('SvgGradientStyles', () => {
    it('renders a linearGradient for each series with matching id and color', () => {
        render(
            <svg>
                <SvgGradientStyles
                    series={[
                        { id: 's1', color: '#111' } as CommonSeriesType<number>,
                        { id: 's2', color: '#222' } as CommonSeriesType<number>,
                    ]}
                />
            </svg>
        );
        const gradients = document.querySelectorAll('linearGradient');
        expect(gradients.length).toBe(2);
        expect(
            gradients[1]
                .querySelector('stop[offset="1"]')
                ?.getAttribute('stop-color')
        ).toBe('#222');
    });
});
