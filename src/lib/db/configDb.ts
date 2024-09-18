import type { FileDb } from "./jsondb";


export type servoConfig = {
    name: string,
    hardware: string,
    channel: number,
    // minPos: number,
    // maxPos: number,
    homePos: number

}[];

export class ConfigDb {
    private db: FileDb;

    constructor(db: FileDb) {
        this.db = db;
    }

    async getServos(): Promise<servoConfig> {
        const data = await this.db.read()
        return data['servos'] as servoConfig || {};
    }
}