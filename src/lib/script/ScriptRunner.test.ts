import { describe, it, expect, afterAll, vi } from 'vitest';
import { ScriptRunner, type ScriptHandler, type ScriptHandlers } from './ScriptRunner';
import fsp from 'fs/promises';
import { delay } from '$lib/utils/delay';

describe('ScriptRunner', () => {

    const testFilePath = "./testScript";

    const defaultHandler: ScriptHandler = async (args, handlerName) => {
        console.log(handlerName, args);
    }

    afterAll(async () => {
        await fsp.rm(testFilePath);
    });

    it('should use the default handler if non more specific matches', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'a,b,c\n1,2,3\n4,5,6\n');

        const handlers: ScriptHandlers = {
            default: defaultHandler
        }

        const spy = vi.spyOn(handlers, 'default');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledTimes(3);

    });

    it('should skip lines with comments', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'a,b,c\n#test\n4,5,6\n');

        const handlers: ScriptHandlers = {
            default: defaultHandler
        }

        const spy = vi.spyOn(handlers, 'default');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should handle lines with no content', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'a,b,c\n\n4,5,6\n');

        const handlers: ScriptHandlers = {
            default: defaultHandler
        }

        const spy = vi.spyOn(handlers, 'default');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledTimes(2);

    });

    it('should call the handler with the correct arguments', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'testHandler,a,b,c\n');

        const handlers: ScriptHandlers = {
            testHandler: defaultHandler
        }

        const spy = vi.spyOn(handlers, 'testHandler');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledWith(['a', 'b', 'c'], 'testHandler');
    })

    it('should wait for the default handler to finish before processing the next line', async () => {
        //arrange
        await fsp.writeFile(testFilePath, '1,b,c\n2,b,c\n3,b,c\n');

        const handlers: ScriptHandlers = {
            default: async (args, handlerName) => {
                await delay(100);
                console.log(handlerName, args);
            }
        }

        const spy = vi.spyOn(console, 'log');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should wait for the handler to finish before processing the next line', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'anything,b,c\nanything,b,c\nanything,b,c\n');

        const handlers: ScriptHandlers = {
            anything: async (args, handlerName) => {
                await delay(100);
                console.log(handlerName, args);
            }
        }

        const spy = vi.spyOn(console, 'log');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledTimes(3);
    })

    it('should handle files without trailing newline', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'a,b,c');

        const handlers: ScriptHandlers = {
            default: defaultHandler
        }

        const spy = vi.spyOn(handlers, 'default');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('should log an error if no handler is found', async () => {
        //arrange
        await fsp.writeFile(testFilePath, 'unknownHandler,a,b,c\n');

        const handlers: ScriptHandlers = {
            notUnknownHandler: defaultHandler
        }

        const spy = vi.spyOn(console, 'log');

        const scriptRunner = new ScriptRunner(testFilePath, handlers);

        //act
        await scriptRunner.run();

        //assert
        expect(spy).toHaveBeenCalledWith('No handler found for unknownHandler');
    })
});
