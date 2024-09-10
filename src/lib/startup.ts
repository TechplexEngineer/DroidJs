import Joystick from '$lib/joystick-linux';
import { LogitechF310Mapper } from './controllers/logitech-f310';
import { fileDb } from './db/jsondb';
import { polarSteering } from './drivetrain/drive';
import { JoystickCache } from './joystick-linux/joystick-cache';
import { PCA9685 } from './motion/pwm';
import { PwmMotorController, ServoController } from './motion/servo';
import { SoundPlayer } from './sound/player';
import { applyDeadband, mapRange } from './utils/math';

const isRaspberryPi = process.arch === 'arm';
console.log('Is Raspberry Pi:', isRaspberryPi);


const deadband = 0.01;
const maxSpeed = 0.2;

const PortMapping = {
	leftMotor: 0,
	rightMotor: 1,
	dome: 3,
}

export const startup = async () => {
	console.log('Startup', process.cwd());

	const stick = new Joystick('/dev/input/js0', { mappingFn: LogitechF310Mapper.eventMapper });
	const js = new JoystickCache(stick, LogitechF310Mapper);

	console.log('Joystick initialized');

	stick.on('disconnect', () => {
		console.log('Joystick disconnected');
	});

	// stick.on('jserror', () => {
	// 	console.log('Joystick error');
	// });

	const i2cBusNum = 1;

	const i2cBus = isRaspberryPi ? await import('i2c-bus') : await import('$lib/utils/i2c-bus-mock');
	// const i2cBus = await import('$lib/utils/i2c-bus-mock');
	// const i2cBus = await import('i2c-bus');

	const con = await i2cBus.openPromisified(i2cBusNum);
	const pca = new PCA9685(con, 0x40);

	await pca.init();

	await pca.setPWMFreq(50); //Seen others set this to 60

	const motor = new PwmMotorController(pca);

	const servo = new ServoController(pca);


	// let setpoint = 160;

	// js.on('A', (ev) => {
	// 	servo.setAngle(4, setpoint);
	// });
	// js.on('B', (ev) => {
	// 	servo.setAngle(4, 0);
	// });

	// js.on('X', (ev) => {
	// 	setpoint += 1;
	// 	servo.setAngle(4, setpoint);
	// 	console.log('Setpoint:', setpoint);
	// });
	// js.on('Y', (ev) => {
	// 	setpoint -= 1;
	// 	servo.setAngle(4, setpoint);
	// 	console.log('Setpoint:', setpoint);
	// });


	setInterval(() => {
		// Driving
		const { left: l, right: r } = polarSteering(
			applyDeadband(js.getAxisByName('LEFT_STICK_Y'), deadband),
			applyDeadband(js.getAxisByName('LEFT_STICK_X'), deadband)
		);
		const left = mapRange(l, -1, 1, -maxSpeed, maxSpeed);
		const right = mapRange(r, -1, 1, -maxSpeed, maxSpeed);
		// console.log('Left:', left, 'Right:', right);

		motor.setSpeed(PortMapping.leftMotor, left);
		motor.setSpeed(PortMapping.rightMotor, right);

		// Dome
		const dome = applyDeadband(js.getAxisByName('RIGHT_STICK_X'), deadband);
		motor.setSpeed(PortMapping.dome, dome);

	}, 1 * 250);


	const player = new SoundPlayer("./sounds")

	js.on('X', (ev) => {
		if (ev.value !== 1) return; // dont play when button released

		player.playSound("HUM__014.mp3");
	});


	return {
		soundPlayer: player,
		motorController: motor,
		servoController: servo,
		db: new fileDb('./config.json')
	}
};
