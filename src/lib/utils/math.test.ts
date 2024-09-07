import { describe, it, expect } from 'vitest';
import { clamp, copySign } from './math';

describe('clamp', () => {
	it('should return the value when it is within the range', () => {
		expect(clamp(5, 1, 10)).toBe(5);
	});

	it('should return the min value when the value is less than the min', () => {
		expect(clamp(0, 1, 10)).toBe(1);
	});

	it('should return the max value when the value is greater than the max', () => {
		expect(clamp(15, 1, 10)).toBe(10);
	});
});

describe('copySign', () => {
	it('should return the value with the same sign as the sign parameter', () => {
		expect(copySign(5, -1)).toBe(-5);
		expect(copySign(-5, 1)).toBe(5);
	});

	it('should return the value unchanged if the sign parameter has the same sign', () => {
		expect(copySign(5, 1)).toBe(5);
		expect(copySign(-5, -1)).toBe(-5);
	});

	it('should return 0 if the value is 0 regardless of the sign parameter', () => {
		expect(copySign(0, 1)).toBeCloseTo(0);
		expect(copySign(0, -1)).toBeCloseTo(0);
	});
});
