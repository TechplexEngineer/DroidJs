import { describe, it, expect } from 'vitest';
import { LogitechF310Mapper } from './logitech-f310';
import type { jsEvent } from '$lib/joystick-linux/joystick';

describe('LogitechF310Mapper', () => {
    it('should map axis events correctly', () => {
        const axisEvent: jsEvent = { type: 'AXIS', number: 0, value: 10000, time: 0, isInitial: false };
        const mappedEvent = LogitechF310Mapper.eventMapper(axisEvent);
        expect(mappedEvent.name).toBe('LEFT_STICK_X');
        expect(mappedEvent.value).toBeCloseTo(10000 / 32767, 5);
    });

    it('should map button events correctly', () => {
        const buttonEvent: jsEvent = { type: 'BUTTON', number: 0, value: 1, time: 0, isInitial: false };
        const mappedEvent = LogitechF310Mapper.eventMapper(buttonEvent);
        expect(mappedEvent.name).toBe('A');
        expect(mappedEvent.value).toBe(1);
    });

    it('should map trigger events correctly', () => {
        const triggerEvent: jsEvent = { type: 'AXIS', number: 2, value: 32767, time: 0, isInitial: false };
        const mappedEvent = LogitechF310Mapper.eventMapper(triggerEvent);
        expect(mappedEvent.name).toBe('LEFT_TRIGGER');
        expect(mappedEvent.value).toBeCloseTo(1, 5);
    });

    it('should return correct axis number from name', () => {
        expect(LogitechF310Mapper.axisFromName('LEFT_STICK_X')).toBe(0);
        expect(LogitechF310Mapper.axisFromName('RIGHT_TRIGGER')).toBe(5);
    });

    it('should return correct button number from name', () => {
        expect(LogitechF310Mapper.buttonFromName('A')).toBe(0);
        expect(LogitechF310Mapper.buttonFromName('START')).toBe(7);
    });

    it('should return correct axis name from number', () => {
        expect(LogitechF310Mapper.nameFromAxis(0)).toBe('LEFT_STICK_X');
        expect(LogitechF310Mapper.nameFromAxis(1)).toBe('LEFT_STICK_Y');
        expect(LogitechF310Mapper.nameFromAxis(2)).toBe('LEFT_TRIGGER');
        expect(LogitechF310Mapper.nameFromAxis(3)).toBe('RIGHT_STICK_X');
        expect(LogitechF310Mapper.nameFromAxis(4)).toBe('RIGHT_STICK_Y');
        expect(LogitechF310Mapper.nameFromAxis(5)).toBe('RIGHT_TRIGGER');
        expect(LogitechF310Mapper.nameFromAxis(6)).toBe('DPAD_X');
        expect(LogitechF310Mapper.nameFromAxis(7)).toBe('DPAD_Y');
    });

    it('should return correct button name from number', () => {
        expect(LogitechF310Mapper.nameFromButton(0)).toBe('A');
        expect(LogitechF310Mapper.nameFromButton(1)).toBe('B');
        expect(LogitechF310Mapper.nameFromButton(2)).toBe('X');
        expect(LogitechF310Mapper.nameFromButton(3)).toBe('Y');
        expect(LogitechF310Mapper.nameFromButton(4)).toBe('LEFT_BUMPER');
        expect(LogitechF310Mapper.nameFromButton(5)).toBe('RIGHT_BUMPER');
        expect(LogitechF310Mapper.nameFromButton(6)).toBe('BACK');
        expect(LogitechF310Mapper.nameFromButton(7)).toBe('START');
        expect(LogitechF310Mapper.nameFromButton(8)).toBe('LEFT_STICK');
        expect(LogitechF310Mapper.nameFromButton(9)).toBe('RIGHT_STICK');
    });
});