import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServoController } from './servoController';
import type { PwmOutput } from './pwm';
import { delay } from '$lib/utils/delay';

describe('ServoController', () => {
    let pwmOutputMock: PwmOutput;
    let servoController: ServoController;

    beforeEach(() => {
        pwmOutputMock = {
            setPWM: vi.fn()
        };
        servoController = new ServoController(pwmOutputMock);
    });

    it('should set the angle immediately', () => {
        servoController.setAngle(0, 90);
        expect(pwmOutputMock.setPWM).toHaveBeenCalled();
    });

    it('should set the angle slowly over time', async () => {
        const channel = 0;
        const targetAngle = 90;
        const timeMs = 1000;
        const intervalMs = 50;
        const angles: { time: number, angle: number }[] = [];

        await new Promise<void>(async (resolve) => {
            const originalSetAngle = servoController.setAngle.bind(servoController);
            servoController.setAngle = (ch, angle) => {
                if (ch === channel) {
                    angles.push({ time: Date.now(), angle });
                }
                originalSetAngle(ch, angle);
            };

            servoController.setAngleSlow(channel, targetAngle, timeMs);

            const startTime = Date.now();

            await delay(intervalMs + timeMs); // wait for the task to complete

            expect(angles.length).toBeGreaterThan(0);
            angles.forEach(({ time, angle }, index) => {
                console.log(`Time: ${time - startTime}, Angle: ${angle}`);
                if (index > 0) {
                    expect(angle).toBeGreaterThan(angles[index - 1].angle);
                }
            });
            expect(angles[angles.length - 1].angle).toBe(targetAngle);
            resolve();
        });
    }, 5000);
});