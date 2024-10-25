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
import { SoundHandler } from './script/handlers/soundHandler';
import { msSleepHandler, sleepHandler } from './script/handlers/sleepHandler';
import { ServoHandler } from './script/handlers/servoHandler';

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

let controllerMapCache: ControllerMap | null = null;

let driveIntervalHandle: NodeJS.Timeout | null = null;

export const setupEventHandlers = async (
	js: JoystickCache,
	configDb: ConfigDb,
	controllerMapCache: ControllerMap,
	player: SoundPlayer,
	motor: PwmMotorController,
	scriptMgr: ScriptRunnerManager
) => {
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
		await setupEventHandlers(js, configDb, controllerMapCache, player, motor, scriptMgr);
		console.log('Controller map reloaded:', controllerMapCache);
	});

	js.on(controllerMapCache['volumeUp'].buttonOrAxisName, async (ev) => {
		if (ev.value !== controllerMapCache['volumeUp'].axisValue) {
			return;
		}

		if (player.getVolume() < 100 - 4) {
			player.setVolume(player.getVolume() + 5);
			console.log('Volume:', player.getVolume());
			await player.playSound('UTIL/VolumeUp.mp3');
		} else {
			await player.playSound('UTIL/VolumeMax.mp3');
		}
	});

	js.on(controllerMapCache['volumeDown'].buttonOrAxisName, async (ev) => {
		if (ev.value !== controllerMapCache['volumeDown'].axisValue) {
			return;
		}

		if (player.getVolume() > 0 + 4) {
			player.setVolume(player.getVolume() - 5);
			console.log('Volume:', player.getVolume());
		}
		await player.playSound('UTIL/VolumeDown.mp3');
	});

	for (const [_key, value] of Object.entries(controllerMapCache).filter(([key, value]) => value.type == "sound")) {
		console.log('Setting up sound event:', value);

		if (value.category) {
			js.on(value.buttonOrAxisName, async (ev) => {
				if (ev.value !== 1) { // only when button pressed, not released
					return;
				}
				await player.playRandomSound(value.category || null);
			});
		}
	}

	for (const [_key, value] of Object.entries(controllerMapCache).filter(([key, value]) => value.type == "script")) {
		console.log('Setting up script event:', value);

		const scriptName = value.name;
		if (!scriptName) {
			return;
		}
		js.on(value.buttonOrAxisName, async (ev) => {
			if (ev.value !== 1) { // only when button pressed, not released
				return;
			}
			await scriptMgr.runScript(scriptName);
		});
	}
};



export const startup = async (): Promise<App.Locals> => {

	console.log('Startup cwd:', process.cwd());
	// console.log('startup env', process.env)

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


	const con = await i2cBus.openPromisified(i2cBusNum);

	let configFilePath = './config.json';
	if (process.env.NODE_ENV === 'production') {
		console.log('Running in production mode');
		configFilePath = '/home/pi/DroidJs/config.json';
	}

	const filedb = new FileDb(configFilePath);
	const configDb = new ConfigDb(filedb);

	const pcaBody = new PCA9685(con, 0x40);
	await pcaBody.init();
	await pcaBody.setPWMFreq(50); //should be 50 per spark datasheet, 60 does not work
	const motorBody = new PwmMotorController(pcaBody);
	const servoBody = new ServoController(pcaBody);

	if (!isRaspberryPi) {
		// lets mock out setAngle and log what gets set
		servoBody.setAngle = (channel: number, targetAngle: number, allowOutOfBounds = false) => {
			console.log('Servo setAngle:', channel, targetAngle);
		}
	}

	const pcaDome = new PCA9685(con, 0x41);
	await pcaDome.init();
	await pcaDome.setPWMFreq(50); //should be 50 per spark datasheet, 60 does not work
	const servoDome = new ServoController(pcaDome);


	const astropixels = new Astropixels(con);

	let soundDirPath = "./sounds";
	if (process.env.NODE_ENV === 'production') {
		soundDirPath = '/home/pi/DroidJs/sounds'; //@todo don't hardcode this, get from config
	}
	console.log('Sound dir:', soundDirPath);

	const player = new SoundPlayer(soundDirPath)


	// at startup set all servos to home pos
	const servos = await configDb.getServos();

	for (const { hardware, channel, home } of servos) {
		if (hardware == "Dome Servos") {
			servoDome.setAngle(channel, home ?? 0);
		} else if (hardware == "Body Servos") {
			servoBody.setAngle(channel, home ?? 0);
		} else {
			console.log('Unknown servo hardware:', hardware);
		}
	}

	let scriptDirPath = "./scripts";
	if (process.env.NODE_ENV === 'production') {
		scriptDirPath = '/home/pi/DroidJs/scripts'; //@todo don't hardcode this, get from config
	}
	console.log('Script dir:', scriptDirPath);

	const domeHandler = new ServoHandler(servoDome, configDb);
	const bodyHandler = new ServoHandler(servoBody, configDb);
	const soundHandler = new SoundHandler(player);

	const scriptMgr = new ScriptRunnerManager(scriptDirPath, {
		default: async (args, handlerName) => {
			console.log('No handler found for:', handlerName);
		},
		sound: soundHandler.handler.bind(soundHandler),
		sleep: sleepHandler,
		msSleep: msSleepHandler,
		dome: domeHandler.handler.bind(domeHandler),
		body: bodyHandler.handler.bind(bodyHandler),
		rseries: async (args, handlerName) => {
			astropixels.SendRaw(args[0])
		}
	});


	if (!controllerMapCache) {
		controllerMapCache = await configDb.getControllerMap();
		console.log('controllerMapCache:', controllerMapCache);
	}

	js.on("update", async (ev) => {
		if (ev.type.toLowerCase() == "button" && ev.value !== 1) return; // only when button pressed
		console.log('update', JSON.stringify(ev));
	});

	setupEventHandlers(js, configDb, controllerMapCache, player, motorBody, scriptMgr);


	return {
		soundPlayer: player,
		scriptMgr: scriptMgr,
		db: filedb,
		config: configDb,
		servoMgr: servoDome, // somday we will have a servo manager to handle the two servo controllers
	}
};

const initHardware = (configDb: ConfigDb): Record<string, any> => {

	return {};
}