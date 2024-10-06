import type { FileDb } from "./jsondb";


export type servoConfig = {
    name: string,
    hardware: string,
    channel: number,
    // minPos: number,
    // maxPos: number,
    homePos: number

}[];


// given an action (drive Fwd) look up what joystick and button or axis to use
export type Action = string;
export type ActionInput = {
    joystickName: string,
    buttonOrAxisName: string,
    comboKey?: string,
    axisValue?: number
}

export type ControllerMap = Record<Action, ActionInput>;

export class ConfigDb {
    private db: FileDb;

    constructor(db: FileDb) {
        this.db = db;
    }

    async getServos(): Promise<servoConfig> {
        const data = await this.db.read()
        return data['servos'] as servoConfig || {};
    }

    async getControllerMap(): Promise<ControllerMap> {
        const data = await this.db.read()
        return data['controllerMap'] as ControllerMap || {};
    }
}