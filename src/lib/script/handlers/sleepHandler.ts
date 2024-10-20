import { delay } from "$lib/utils/delay";
import { type ScriptHandler } from "$lib/script/ScriptRunner";

/**
 * Sleep for a given amount of miliseconds
 */
export const msSleepHandler: ScriptHandler = async (args: string[], handlerName: string) => {
    if (args[0] === 'random') {
        if (args.length !== 3) {
            console.log('Invalid random sleep arguments, must have min and max');
            return;
        }
        const min = parseInt(args[1]);
        const max = parseInt(args[2]);
        if (isNaN(min) || isNaN(max)) {
            console.log('Invalid random sleep arguments, min and max must be numbers');
            return;
        }
        const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
        await delay(delayTime);
        return;
    }
    const delayTime = parseInt(args[0]);
    if (isNaN(delayTime)) {
        console.log(`Invalid delay time: ${args[0]}`);
        return;
    }
    await delay(delayTime);
}

/**
 * Sleep for a given amount of seconds
 */
export const sleepHandler: ScriptHandler = async (args: string[], handlerName: string) => {
    if (args[0] === 'random') {
        if (args.length !== 3) {
            console.log('Invalid random sleep arguments, must have min and max');
            return;
        }
        const min = parseInt(args[1]);
        const max = parseInt(args[2]);
        if (isNaN(min) || isNaN(max)) {
            console.log('Invalid random sleep arguments, min and max must be numbers');
            return;
        }
        const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
        await delay(delayTime);
        return;
    }
    const delayTime = parseInt(args[0]) * 1000;
    if (isNaN(delayTime)) {
        console.log(`Invalid delay time: ${args[0]}`);
        return;
    }
    await delay(delayTime);
}