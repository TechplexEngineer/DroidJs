import { delay } from '$lib/utils/delay';
import * as fs from 'fs';
import * as readline from 'readline';
import Papa from 'papaparse';

export type ScriptHandler = (args: string[], handlerName: string) => Promise<void>;
export type ScriptHandlers = Record<string, ScriptHandler>;

export class ScriptRunner {
    private scriptPath: string;
    private handlers: ScriptHandlers;


    constructor(scriptPath: string, handlers: ScriptHandlers) {
        this.scriptPath = scriptPath;
        this.handlers = handlers;
    }

    async run() {

        const fileStream = fs.createReadStream(this.scriptPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const csvLine of rl) {
            const line = Papa.parse<string[]>(csvLine, { comments: '#' });
            if (line.data.length === 0) {
                console.log('Skipping line: ', csvLine);
                continue;
            }
            await this.processLine(line.data[0]);
        }
    }

    private async processLine(line: string[]): Promise<void> {
        const args = line.slice(1);
        const handlerName = line[0];

        if (this.handlers[handlerName]) {
            await this.handlers[handlerName](args, handlerName);
        } else if (this.handlers['default']) {
            await this.handlers['default'](args, `default(${handlerName})`);
        } else {
            console.log(`No handler found for ${handlerName}`);
        }
    }


}