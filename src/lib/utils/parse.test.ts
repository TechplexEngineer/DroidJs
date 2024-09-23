import { describe, it, expect } from 'vitest';
import { parseHex } from './parse';

describe('parseHex', () => {
    it('parses a hex string without leading 0x', () => {
        expect(parseHex('1A')).toBe(26);
    });

    it('parses a hex string with leading 0x', () => {
        expect(parseHex('0x1A')).toBe(26);
    });

    it('parses a hex string with lowercase letters', () => {
        expect(parseHex('0x1a')).toBe(26);
    });

    it('parses a hex string with mixed case letters', () => {
        expect(parseHex('0x1aF')).toBe(431);
    });

    it('returns NaN for invalid hex string', () => {
        expect(parseHex('0xGHI')).toBeNaN();
    });
});