import { Joystick } from '$lib/joystick-linux/joystick';
import { LogitechF310Mapper } from './controllers/logitech-f310';
import { ConfigDb, type ControllerMap } from './db/configDb';
import { FileDb } from './db/jsondb';
import { polarSteering } from './drivetrain/drive';
import { JoystickCache } from './joystick-linux/joystick-cache';
import { Astropixels } from './lights/astropixels';
import { PCA9685 } from './motion/pwm';
import { PwmMotorController } from './motion/pwmMotor';
import { ServoController } from './motion/servoController';
import { SoundPlayer } from './sound/player';
import { applyDeadband, mapRange } from './utils/math';
import { browser, building, dev, version } from '$app/environment';
import os from 'os';
import { ScriptRunnerManager } from './script/ScriptRunnerManager';

const isRaspberryPi = os.arch() === 'arm64' && os.platform() === 'linux';
console.log('Is Raspberry Pi:', isRaspberryPi);


const deadband = 0.01;
const maxSpeed = 0.5;
const domeMaxSpeed = .2;

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
let controllerMapCache: ControllerMap | null = null;
let volume = 50; //@todo load from config file, save to config file

let driveIntervalHandle: NodeJS.Timeout | null = null;

export const setupEventHandlers = async (js: JoystickCache, configDb: ConfigDb, controllerMapCache: ControllerMap, player: SoundPlayer, motor: PwmMotorController) => {
	console.log('setupEventHandlers');
	js.removeAllListeners();
	if (driveIntervalHandle) {
		clearInterval(driveIntervalHandle);
		driveIntervalHandle = null;
	}
	driveIntervalHandle = setInterval(async () => {
		if (!controllerMapCache) {
			controllerMapCache = await configDb.getControllerMap();
			console.log('Controller map reloaded: WHILE DRIVING', controllerMapCache); // we don't expect this to happen, but it makes TSC happy
		}
		// Driving
		const { left: l, right: r } = polarSteering(
			applyDeadband(js.getAxisByName(controllerMapCache['drive'].buttonOrAxisName), deadband),
			applyDeadband(js.getAxisByName(controllerMapCache['turn'].buttonOrAxisName), deadband)
		);
		const left = mapRange(l, -1, 1, -maxSpeed, maxSpeed);
		const right = mapRange(r, -1, 1, -maxSpeed, maxSpeed);
		if (left !== 0 || right !== 0) {
			console.log('DRIVE\tLeft:', left, 'Right:', right);
		}

		motor.setSpeed(PortMapping.leftMotor, -left);
		motor.setSpeed(PortMapping.rightMotor, right);

		// Dome
		const dome = applyDeadband(js.getAxisByName(controllerMapCache['dome'].buttonOrAxisName), deadband) * domeMaxSpeed;
		motor.setSpeed(PortMapping.dome, dome);
		if (dome !== 0) {
			console.log('DOME\t', dome);
		}

	}, 1 * 250);

	// js.on("update", async (ev) => {
	// 	// if (ev.value !== 1) return; // only when button pressed
	// 	console.log('update', JSON.stringify(ev));
	// });

	js.on(controllerMapCache['reload'].buttonOrAxisName, async (ev) => {
		if (ev.value !== 1) return; // only when button pressed

		controllerMapCache = await configDb.getControllerMap();
		await setupEventHandlers(js, configDb, controllerMapCache, player, motor);
		console.log('Controller map reloaded:', controllerMapCache);
	});

	js.on(controllerMapCache['volumeUp'].buttonOrAxisName, async (ev) => {
		if (ev.value !== controllerMapCache['volumeUp'].axisValue) {
			return;
		}

		if (volume < 100 - 4) {
			volume += 5;
			console.log('Volume:', volume);
			await player.playSound('UTIL/VolumeUp.mp3', volume);
		} else {
			await player.playSound('UTIL/VolumeMax.mp3', volume);
		}
	});

	js.on(controllerMapCache['volumeDown'].buttonOrAxisName, async (ev) => {
		if (ev.value !== controllerMapCache['volumeDown'].axisValue) {
			return;
		}

		if (volume > 0 + 4) {
			volume -= 5;
			console.log('Volume:', volume);
		}
		await player.playSound('UTIL/VolumeDown.mp3', volume);
	});

	for (const [_key, value] of Object.entries(controllerMapCache).filter(([key, value]) => value.type == "sound")) {
		console.log('Setting up sound event:', value);

		if (value.category) {
			js.on(value.buttonOrAxisName, async (ev) => {
				if (ev.value !== 1) { // only when button pressed, not released
					return;
				}
				await player.playRandomSound(value.category || null, volume);
			});
		}
	}

};

export const startup = async (): Promise<App.Locals> => {

	console.log('Startup cwd:', process.cwd());
	console.log('startup env', process.env)

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

	const i2cBus = isRaspberryPi ? await import('i2c-bus') : await import('$lib/utils/i2c-bus-mock');
	// const i2cBus = await import('$lib/utils/i2c-bus-mock');
	// const i2cBus = await import('i2c-bus');

	const con = await i2cBus.openPromisified(i2cBusNum);
	const pca = new PCA9685(con, 0x40);

	await pca.init();

	await pca.setPWMFreq(50); //should be 50 per spark datasheet, 60 does not wor

	const motor = new PwmMotorController(pca);

	const servo = new ServoController(pca);

	const astropixels = new Astropixels(con);

	let soundDirPath = "./sounds";
	if (process.env.NODE_ENV === 'production') {
		soundDirPath = '/home/pi/DroidJs/sounds'; //@todo don't hardcode this, get from config
	}
	console.log('Sound dir:', soundDirPath);

	const player = new SoundPlayer(soundDirPath)

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

	let scriptDirPath = "./scripts";
	if (process.env.NODE_ENV === 'production') {
		scriptDirPath = '/home/pi/DroidJs/scripts'; //@todo don't hardcode this, get from config
	}
	console.log('Script dir:', scriptDirPath);

	const scriptMgr = new ScriptRunnerManager(scriptDirPath, {});


	if (!controllerMapCache) {
		controllerMapCache = await configDb.getControllerMap();
		console.log('controllerMapCache:', controllerMapCache);
	}

	js.on("update", async (ev) => {
		// if (ev.value !== 1) return; // only when button pressed
		console.log('update', JSON.stringify(ev));
	});

	setupEventHandlers(js, configDb, controllerMapCache, player, motor);


	// randomSoundAlarm
	// randomSoundOoh
	// randomSoundMisc
	// randomSoundSentence

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






	return {
		soundPlayer: player,
		scriptMgr: scriptMgr,
		db: filedb,
		// motorController: motor,
		// servoController: servo,

	}
};
