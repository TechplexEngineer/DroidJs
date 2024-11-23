import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServoHandler } from './servoHandler';
import type { ServoController } from '$lib/motion/servoController';
import { ConfigDb } from '$lib/db/configDb';

describe('ServoHandler', () => {
    let servoController: ServoController;
    let configDb: ConfigDb;
    let servoHandler: ServoHandler;

    beforeEach(() => {
        servoController = {
            setAngle: vi.fn(),
            setAngleSlow: vi.fn(),
        } as unknown as ServoController;

        configDb = {
            getServos: vi.fn().mockResolvedValue([
                {
                  "name": "PP1",
                  "desc": "Dome Pie Panel 1",
                  "hardware": "Dome Servos",
                  "channel": 6,
                  "min": 15,
                  "max": 115,
                  "home": 15
                },
                {
                  "name": "PP2",
                  "desc": "Dome Pie Panel 2",
                  "hardware": "Dome Servos",
                  "channel": 10,
                  "min": 15,
                  "max": 120,
                  "home": 15
                }]),
        } as unknown as ConfigDb;

        servoHandler = new ServoHandler(servoController, configDb);
    });

    it('should set the angle of the servo based on the configured max', async () => {
        const args = ['PP1', '1'];
        const handlerName = 'testHandler';
        await servoHandler.handler(args, handlerName);
        expect(servoController.setAngle).toHaveBeenCalledWith(6, 115);
    });

    it('should log an error if args length is not 2', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const args = ['PP1'];
        const handlerName = 'testHandler';
        await servoHandler.handler(args, handlerName);
        expect(consoleSpy).toHaveBeenCalledWith('Invalid servo arguments, must have servo name and angle', args);
    });

    it('should log an error if angle is not a number', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const args = ['PP1', 'not-a-number'];
        const handlerName = 'testHandler';
        await servoHandler.handler(args, handlerName);
        expect(consoleSpy).toHaveBeenCalledWith('Invalid servo arguments, servo name and angle must be numbers', args);
    });

    it('should log an error if servo name does not exist in config', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const args = ['doesNotExist', '90'];
        const handlerName = 'testHandler';
        await servoHandler.handler(args, handlerName);
        expect(consoleSpy).toHaveBeenCalledWith('servo named doesNotExist does not exist in config');
    });

    it('should handle a third argument which is the duration of the move', async () => {
        const args = ['PP1', '1', '1000'];
        const handlerName = 'testHandler';
        await servoHandler.handler(args, handlerName);
        expect(servoController.setAngleSlow).toHaveBeenCalledWith(6, 115, 1000);
    });
});