//untested does not work


import { PCA9685 } from "./pwm";
import { PwmMotorController } from "./pwmMotor";
import i2cBus from 'i2c-bus';
export const allOff = (motor: PwmMotorController) => {
    motor.setSpeed(0, 0);
    motor.setSpeed(1, 0);
    motor.setSpeed(3, 0);
}
const i2cBusNum = 1;
const con = await i2cBus.openPromisified(i2cBusNum);
const pca = new PCA9685(con, 0x40);
let motor = new PwmMotorController(pca);

allOff(motor);