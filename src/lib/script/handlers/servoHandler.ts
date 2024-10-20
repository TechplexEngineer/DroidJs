
import { ConfigDb } from "$lib/db/configDb"
import type { ServoController } from "$lib/motion/servoController";
import type { Handler } from "./iHandler";

export class ServoHandler implements Handler {
    private servoController: ServoController;
    private config: ConfigDb;

    constructor(servoController: ServoController, config: ConfigDb) {
        this.servoController = servoController;
        this.config = config;
    }

    async handler(args: string[], handlerName: string) {
        if (![2,3].includes(args.length)) {
            console.log('Invalid servo arguments, must have servo name and angle', args);
            return;
        }
        const servoName = args[0] as string;
        const arg1 = parseInt(args[1]);
        if (isNaN(arg1)) {
            console.log('Invalid servo arguments, servo name and angle must be numbers', args);
            return;
        }
        const open = arg1 === 1
        const servos = await this.config.getServos();
        const servo = servos.find(servo => servo.name === servoName);
        if (!servo) {
            console.log(`servo named ${servoName} does not exist in config`);
            return;
        }
        const angle = open ? servo.max : servo.min;
        if (args.length === 3) {
            const duration = parseInt(args[2]);
            this.servoController.setAngleSlow(servo.channel, angle, duration);
            return;
        }

        this.servoController.setAngle(servo.channel, angle);
    }
}