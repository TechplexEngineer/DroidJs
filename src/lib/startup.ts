import { Joystick } from '$lib/joystick-linux/joystick';
import { LogitechF310Mapper } from './controllers/logitech-f310';
import { ConfigDb } from './db/configDb';
import { FileDb } from './db/jsondb';
import { polarSteering } from './drivetrain/drive';
import { JoystickCache } from './joystick-linux/joystick-cache';
import { Astropixels } from './lights/astropixels';
import { PCA9685 } from './motion/pwm';
import { PwmMotorController, ServoController } from './motion/servo';
import { SoundPlayer } from './sound/player';
import { applyDeadband, mapRange } from './utils/math';
import { browser, building, dev, version } from '$app/environment';
import os from 'os';

const isRaspberryPi = os.arch() === 'arm64' && os.platform() === 'linux';
console.log('Is Raspberry Pi:', isRaspberryPi);


const deadband = 0.01;
const maxSpeed = 0.2;

const PortMapping = {
	leftMotor: 0,
	rightMotor: 1,
	dome: 3,
}

if (import.meta.hot) {
	console.log('Hot reload enabled');
	import.meta.hot.accept(() => {
		console.log('reload!');
	});
}

export const startup = async () => {
	if (building) {
		console.log('Building, skipping hardware startup');
		return {};
	}
	console.log('Startup cwd:', process.cwd());

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

	const astropixels = new Astropixels(con);

	let configFilePath = './config.json';
	if (process.env.NODE_ENV === 'production') {
		console.log('Running in production mode');
		configFilePath = '/home/pi/DroidJs/config.json';
	}

	const filedb = new FileDb(configFilePath);
	const configDb = new ConfigDb(filedb);

	// at startup set all servos to home pos
	const servos = await configDb.getServos();
	console.log('Servos:', servos);

	for (const { name, channel, homePos } of servos) {
		servo.setAngle(channel, homePos ?? 0);
	}


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

		motor.setSpeed(PortMapping.leftMotor, -left);
		motor.setSpeed(PortMapping.rightMotor, right);

		// Dome
		const dome = applyDeadband(js.getAxisByName('RIGHT_STICK_X'), deadband);
		motor.setSpeed(PortMapping.dome, dome);

	}, 1 * 250);


	let soundDirPath = "./sounds";
	if (process.env.NODE_ENV === 'production') {
		soundDirPath = '/home/pi/DroidJs/sounds';
	}

	const player = new SoundPlayer(soundDirPath)

	js.on('X', (ev) => {
		if (ev.value !== 1) return; // dont play when button released

		player.playSound("HUM/HUM__014.mp3");
	});


	return {
		soundPlayer: player,
		motorController: motor,
		servoController: servo,
		db: filedb
	}
};
