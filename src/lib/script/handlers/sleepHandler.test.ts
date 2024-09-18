import { describe, it, expect, vi } from 'vitest';
import { sleepHandler } from './sleepHandler';
import { delay } from '$lib/utils/delay';


vi.mock('$lib/utils/delay', () => ({
    delay: vi.fn(),
}));

describe('sleepHandler', () => {
    it('should call delay with the correct time', async () => {
        const args = ['1000'];
        const handlerName = 'testHandler';
        await sleepHandler(args, handlerName);
        expect(delay).toHaveBeenCalledWith(1000);
    });

    it('should handle non-numeric input gracefully', async () => {
        const args = ['not-a-number'];
        const handlerName = 'testHandler';
        await sleepHandler(args, handlerName);
        expect(delay).toBeCalledTimes(0);
    });

    it('should handle empty args array', async () => {
        const args: string[] = [];
        const handlerName = 'testHandler';
        await sleepHandler(args, handlerName);
        expect(delay).toHaveBeenCalledWith(NaN);
    });
});
