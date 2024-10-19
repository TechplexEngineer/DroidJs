import type { FileDb } from "./jsondb";


export type servoConfig = {
    name: string,
    hardware: string,
    channel: number,
    min: number,
    max: number,
    home: number
};


// given an action (drive Fwd) look up what joystick and button or axis to use
export type Action = string;
export type ActionInput = {
    joystickName: string,
    buttonOrAxisName: string,
    comboKey?: string,
    axisValue?: number,
    type?: string // only 'sound' supported now
    category?: string // only supported when type is 'sound'
}

export type ControllerMap = Record<Action, ActionInput>;

export class ConfigDb {
    private db: FileDb;

    constructor(db: FileDb) {
        this.db = db;
    }

    async getServos(): Promise<servoConfig[]> {
        const data = await this.db.read()
        return data['servos'] as servoConfig[] || {};
    }

    async getControllerMap(): Promise<ControllerMap> {
        const data = await this.db.read()
        return data['controllerMap'] as ControllerMap || {};
    }

    async updateServoByName(name: string, data: Partial<servoConfig>) {
        const servos = await this.getServos();
        const index = servos.findIndex((s) => s.name == name);
        if (index == -1) {
            throw new Error(`Servo not found: ${name}`);
        }
        servos[index] = { ...servos[index], ...data };
        console.log("Servos", servos)
        await this.db.update((d) => {
            d['servos'] = servos;
            return d;
        });
    }
}