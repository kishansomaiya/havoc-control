import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from './Section';
import { SectionSet } from './SectionSet';
import { SubSection } from './SubSection';

describe('Section primitives', () => {
    it('Section renders title and children', () => {
        render(
            <Section title="T">
                <div data-testid="child" />
            </Section>
        );
        expect(screen.getByText('T')).toBeInTheDocument();
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('SectionSet renders children vertically', () => {
        render(
            <SectionSet>
                <div data-testid="c1" />
                <div data-testid="c2" />
            </SectionSet>
        );
        expect(screen.getByTestId('c1')).toBeInTheDocument();
        expect(screen.getByTestId('c2')).toBeInTheDocument();
    });

    it('SubSection renders heading and children', () => {
        render(
            <SubSection heading={<div data-testid="heading">H</div>}>
                <div data-testid="subchild" />
            </SubSection>
        );
        expect(screen.getByTestId('heading')).toBeInTheDocument();
        expect(screen.getByTestId('subchild')).toBeInTheDocument();
    });
});

describe('Section primitives', () => {
    it('renders Section title and children', () => {
        render(
            <Section title="T">
                <div data-testid="s-child">X</div>
            </Section>
        );
        expect(screen.getByText('T')).toBeInTheDocument();
        expect(screen.getByTestId('s-child')).toHaveTextContent('X');
    });

    it('renders SectionSet children', () => {
        render(
            <SectionSet>
                <div data-testid="ss-child">Y</div>
            </SectionSet>
        );
        expect(screen.getByTestId('ss-child')).toHaveTextContent('Y');
    });

    it('renders SubSection heading and children', () => {
        render(
            <SubSection heading={<div data-testid="head">H</div>}>
                <div data-testid="sub-child">Z</div>
            </SubSection>
        );
        expect(screen.getByTestId('head')).toHaveTextContent('H');
        expect(screen.getByTestId('sub-child')).toHaveTextContent('Z');
    });
});
