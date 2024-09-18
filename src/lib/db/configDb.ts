import type { fileDb } from "./jsondb";

export type servoParams = {
    // minPos: number,
    // maxPos: number,
    // homePos: number
    channel: number
}
export type servoConfig = Record<string, servoParams>;

export class configDb {
    private db: fileDb;

    constructor(db: fileDb) {
        this.db = db;
    }

    async getServos(): Promise<servoConfig> {
        const data = await this.db.read()
        return data['servos'] as servoConfig
    }
}