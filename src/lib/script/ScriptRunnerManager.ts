import { ScriptRunner, type ScriptHandlers } from "./ScriptRunner";
import fs from 'fs/promises'

export class ScriptRunnerManager {
    private runners = new Map<string, ScriptRunner>();
    private scriptDirectory: string;
    private handlers: ScriptHandlers;

    //eg. /home/pi/DroidJs/sounds/
    constructor(scriptDirectory: string, handlers: ScriptHandlers) {
        this.scriptDirectory = scriptDirectory;
        this.handlers = handlers;
    }

    async runScript(scriptName: string) {
        const scriptPath = `${this.scriptDirectory}/${scriptName}`;
        const scriptRunner = new ScriptRunner(scriptPath, this.handlers);
        this.runners.set(scriptName, scriptRunner);
        await scriptRunner.run();
        this.runners.delete(scriptName);
    }
    
    getRunningScripts() {
        return this.runners.keys();
    }

    stopAllScripts() {
        for (const runner of this.runners.values()) {
            runner.stop();
        }
    }

    async listScripts() {
        const listing = await fs.readdir(this.scriptDirectory, { recursive: true });
        return listing.filter((file) => file.endsWith('.scr'));
    }
}