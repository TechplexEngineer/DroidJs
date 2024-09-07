import Joystick from '$lib/joystick-linux';
import { LogitechF310Mapper } from './controllers/logitech-f310';
import { polarSteering } from './drivetrain/drive';
import { JoystickCache } from './joystick-linux/joystick-cache';
import { PCA9685 } from './motion/pwm';
import { PwmMotorController } from './motion/servo';
import { applyDeadband, mapRange } from './utils/math';

import i2cBus from 'i2c-bus';

const deadband = 0.01;
const maxSpeed = 0.2;

export const startup = async () => {
	console.log('Startup');

	const stick = new Joystick('/dev/input/js0', { mappingFn: LogitechF310Mapper.eventMapper });
	const js = new JoystickCache(stick, LogitechF310Mapper);

	console.log('Joystick initialized');

	stick.on('disconnect', () => {
		console.log('Joystick disconnected');
	});

	stick.on('jserror', () => {
		console.log('Joystick error');
	});

	const i2cBusNum = 1;
	const con = await i2cBus.openPromisified(i2cBusNum);
	const pca = new PCA9685(con, 0x40);

	await pca.init();

	const pwm = new PwmMotorController(pca);

	setInterval(() => {
		const { left: l, right: r } = polarSteering(
			applyDeadband(js.getAxisByName('LEFT_STICK_Y'), deadband),
			applyDeadband(js.getAxisByName('RIGHT_STICK_X'), 0.01)
		);
		const left = mapRange(l, -1, 1, -maxSpeed, maxSpeed);
		const right = mapRange(r, -1, 1, -maxSpeed, maxSpeed);
		console.log('Left:', left, 'Right:', right);

		pwm.setSpeed(0, left);
		pwm.setSpeed(1, right);
	}, 1 * 250);
};
