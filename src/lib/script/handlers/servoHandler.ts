import type { ServoController } from "$lib/motion/servo";
import { ConfigDb } from "$lib/db/configDb"
import type { Handler } from "./iHandler";

export class ServoHandler implements Handler {
    private servoController: ServoController;
    private config: ConfigDb;

    constructor(servoController: ServoController, config: ConfigDb) {
        this.servoController = servoController;
        this.config = config;
    }

    async handler(args: string[], handlerName: string) {
        if (args.length !== 2) {
            console.log('Invalid servo arguments, must have servo number and angle');
            return;
        }
        const servoName = args[0];
        const angle = parseInt(args[1]);
        if (isNaN(angle)) {
            console.log('Invalid servo arguments, servo number and angle must be numbers');
            return;
        }
        const servos = await this.config.getServos();
        if (!servos[servoName]) {
            console.log(`servo named ${servoName} does not exist in confg`);
            return;
        }

        this.servoController.setAngle(servos[servoName].channel, angle);
    }
}