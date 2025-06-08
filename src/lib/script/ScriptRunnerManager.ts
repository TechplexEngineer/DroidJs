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
        console.log("Running script:", scriptName);
        this.runners.set(scriptName, scriptRunner);
        await scriptRunner.run();
        this.runners.delete(scriptName);
        console.log("Done script:", scriptName);
    }

    async getScript(scriptName: string) {
        const scriptPath = `${this.scriptDirectory}/${scriptName}`;
        try {
            const scriptContent = await fs.readFile(scriptPath, 'utf-8');
            return scriptContent;
        } catch (error) {
            console.error(`Error reading script ${scriptName}:`, error);
            throw error;
        }
    }

    async updateScript(scriptName: string, script: string) {
        const scriptPath = `${this.scriptDirectory}/${scriptName}`;
        try {
            await fs.writeFile(scriptPath, script, 'utf-8');
            console.log(`Script ${scriptName} updated successfully.`);
        } catch (error) {
            console.error(`Error updating script ${scriptName}:`, error);
            throw error;
        }
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
        return listing; //.filter((file) => file.endsWith('.scr'))
            // .map(file => file.slice(0, file.lastIndexOf(".scr")));
    }
}