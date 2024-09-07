import Joystick from '$lib/joystick-linux';
import { LogitechF310Mapper } from './controllers/logitech-f310';
import { polarSteering } from './drivetrain/drive';
import { JoystickCache } from './joystick-linux/joystick-cache';
import { applyDeadband, mapRange } from './utils/math';

const deadband = 0.01;
const maxSpeed = 0.2;

export const startup = () => {
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

	setInterval(() => {
		// console.log('Joystick cache:', jsCache.getAxis(0));
		const { left: l, right: r } = polarSteering(
			applyDeadband(js.getAxisByName('LEFT_STICK_Y'), deadband),
			applyDeadband(js.getAxisByName('RIGHT_STICK_X'), 0.01)
		);
		const left = mapRange(l, -1, 1, -maxSpeed, maxSpeed);
		const right = mapRange(r, -1, 1, -maxSpeed, maxSpeed);
		console.log('Left:', left, 'Right:', right);
	}, 1 * 250);

	// stick.on('update', (ev) => {
	// 	joystickCache[`${ev.type}_${ev.number}`] = ev;
	// 	// console.log(ev);
	// });

	// setInterval(() => {
	// 	console.log('Joystick cache:', joystickCache);
	// }, 1 * 1000);
};
