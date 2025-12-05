import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    roundedCurrencyString,
    formatUnit,
    abbreviateNumber,
} from './formatter.util';

describe('Formatter Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('roundedCurrencyString', () => {
        it('should format currency with 2 decimal places', () => {
            expect(roundedCurrencyString(123.456)).toBe('123.46');
            expect(roundedCurrencyString(123.1)).toBe('123.10');
            expect(roundedCurrencyString(123)).toBe('123.00');
        });

        it('should handle negative numbers', () => {
            expect(roundedCurrencyString(-123.456)).toBe('-123.46');
        });

        it('should handle zero', () => {
            expect(roundedCurrencyString(0)).toBe('0.00');
        });

        it('should handle very small numbers', () => {
            expect(roundedCurrencyString(0.001)).toBe('0.00');
            expect(roundedCurrencyString(0.006)).toBe('0.01');
        });

        it('should not use grouping separators', () => {
            expect(roundedCurrencyString(1234.56)).toBe('1234.56');
            expect(roundedCurrencyString(1234567.89)).toBe('1234567.89');
        });

        it('should handle Infinity', () => {
            expect(roundedCurrencyString(Infinity)).toBe('∞');
        });

        it('should handle NaN', () => {
            expect(roundedCurrencyString(NaN)).toBe('NaN');
        });
    });

    describe('formatUnit', () => {
        it('should pluralize when value is not 1', () => {
            expect(formatUnit(0, 'item')).toBe('0 items');
            expect(formatUnit(2, 'item')).toBe('2 items');
            expect(formatUnit(10, 'file')).toBe('10 files');
        });

        it('should not pluralize when value is 1', () => {
            expect(formatUnit(1, 'item')).toBe('1 item');
            expect(formatUnit(1, 'file')).toBe('1 file');
        });

        it('should use custom ending', () => {
            expect(formatUnit(2, 'child', 'ren')).toBe('2 children');
            expect(formatUnit(1, 'child', 'ren')).toBe('1 child');
        });

        it('should handle negative numbers', () => {
            expect(formatUnit(-1, 'item')).toBe('-1 items');
            expect(formatUnit(-2, 'item')).toBe('-2 items');
        });

        it('should handle decimal numbers', () => {
            expect(formatUnit(1.5, 'item')).toBe('1.5 items');
            expect(formatUnit(0.5, 'item')).toBe('0.5 items');
        });

        it('should handle zero explicitly', () => {
            expect(formatUnit(0, 'item')).toBe('0 items');
        });
    });

    describe('abbreviateNumber', () => {
        it('should handle zero', () => {
            expect(abbreviateNumber(0)).toBe('0.00');
            expect(abbreviateNumber(0, 0)).toBe('0');
            expect(abbreviateNumber(0, 1)).toBe('0.0');
        });

        it('should format thousands', () => {
            expect(abbreviateNumber(1000)).toBe('1.00K');
            expect(abbreviateNumber(1500)).toBe('1.50K');
            expect(abbreviateNumber(999)).toBe('999.00');
        });

        it('should format millions', () => {
            expect(abbreviateNumber(1000000)).toBe('1.00M');
            expect(abbreviateNumber(1500000)).toBe('1.50M');
        });

        it('should format billions', () => {
            expect(abbreviateNumber(1000000000)).toBe('1.00B');
            expect(abbreviateNumber(2500000000)).toBe('2.50B');
        });

        it('should format trillions', () => {
            expect(abbreviateNumber(1000000000000)).toBe('1.00T');
            expect(abbreviateNumber(1500000000000)).toBe('1.50T');
        });

        it('should handle very large numbers (beyond trillions)', () => {
            expect(abbreviateNumber(1000000000000000)).toBe('1000.00T');
        });

        it('should respect decimal places parameter', () => {
            expect(abbreviateNumber(1500, 0)).toBe('2K');
            expect(abbreviateNumber(1500, 1)).toBe('1.5K');
            expect(abbreviateNumber(1500, 3)).toBe('1.500K');
        });

        it('should handle negative numbers', () => {
            expect(abbreviateNumber(-1500)).toBe('-1.50K');
            expect(abbreviateNumber(-1000000)).toBe('-1.00M');
        });

        it('should handle numbers less than 1000', () => {
            expect(abbreviateNumber(999)).toBe('999.00');
            expect(abbreviateNumber(100)).toBe('100.00');
            expect(abbreviateNumber(1)).toBe('1.00');
        });

        it('should handle decimal inputs', () => {
            expect(abbreviateNumber(1500.75)).toBe('1.50K');
            expect(abbreviateNumber(999.99)).toBe('999.99');
        });
    });
});
