import Joystick from '$lib/joystick-linux';
import { LogitechF310Mapper } from './controllers/logitech-f310';
import { polarSteering } from './drivetrain/drive';
import { JoystickCache } from './joystick-linux/joystick-cache';
import { PCA9685 } from './motion/pwm';
import { PwmMotorController, ServoController } from './motion/servo';
import { applyDeadband, mapRange } from './utils/math';
import { spawn } from 'child_process';

import i2cBus from 'i2c-bus';

const deadband = 0.01;
const maxSpeed = 0.2;

const PortMapping = {
	leftMotor: 0,
	rightMotor: 1,
	dome: 3,
}

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

	await pca.setPWMFreq(50);

	const pwm = new PwmMotorController(pca);

	const servo = new ServoController(pca);

	let setpoint = 160;

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

		pwm.setSpeed(PortMapping.leftMotor, left);
		pwm.setSpeed(PortMapping.rightMotor, right);

		// Dome
		const dome = applyDeadband(js.getAxisByName('RIGHT_STICK_X'), deadband);
		pwm.setSpeed(PortMapping.dome, dome);

	}, 1 * 250);

	// var player = new soundplayer({filename: "/home/pi/r2_control/HUM__014.mp3", debug:true, player: "mpg123"})
	js.on('Y', (ev) => {
		if (ev.value !== 1) return; // dont play when button released

		console.log('Playing sound', ev);
		const process = spawn('mpg321', ["-q", "/home/pi/r2_control/sounds/HUM__014.mp3", '-g', "50"]);

		let stdOut: string[] = [];
		let stdErr: string[] = [];

		process.stdout.on('data', (data) => {
    		stdOut.push(data);
		});

		process.stderr.on('data', (data) => {
    		stdErr.push(data);
		});

		process.on('close', (code) => {
			if (code !== 0) {
				console.log(`child process exited with code ${code}`);
				console.log(stdOut.join('\n'));
				console.error(stdErr.join('\n'));
			}
		//   console.log(`child process exited with code ${code}`);
		}); 

		console.log('sound.js started');
		// console.log('Playing sound');
		// player.play();
		// spawn('mpg321', ["/home/pi/r2_control/HUM__014.mp3", '-g', "50"]); //, '-a', this.options.device
	});


	
	
	
};
