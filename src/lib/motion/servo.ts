import { clamp, mapRange } from '$lib/utils/math';
import type { PwmOutput } from './pwm';

// export class Servo {
// 	range: number;
// 	minPulseWidth: number;
// 	maxPulseWidth: number;

// 	constructor(range = 180, minPulseWidth = 750, maxPulseWidth = 2250) {
// 		this.range = range;
// 		this.minPulseWidth = minPulseWidth;
// 		this.maxPulseWidth = maxPulseWidth;
// 	}

// 	getAngle() {}
// 	setAngle() {}
// }

export class PwmMotorController {
	pwmControllerOutput: PwmOutput;
	minPulseUs: number;
	maxPulseUs: number;
	frequencyHz: number;

	constructor(pwmOut: PwmOutput, minPulseUs = 750, maxPulseUs = 2250, frequencyHz = 50) {
		this.pwmControllerOutput = pwmOut;
		this.minPulseUs = minPulseUs;
		this.maxPulseUs = maxPulseUs;
		this.frequencyHz = frequencyHz;
	}

	// speed is a number between -1 and 1
	setSpeed(channel: number, speed: number) {
		speed = clamp(speed, -1, 1);

		const pulseWidth = mapRange(speed, -1, 1, this.minPulseUs, this.maxPulseUs);

		const usPerSecond = 1_000_000;
		const oneCycleUs = usPerSecond / this.frequencyHz;

		const onTime = 0;
		const offTime = mapRange(pulseWidth, 0, oneCycleUs, 0, 4095);

		this.pwmControllerOutput.setPWM(channel, onTime, offTime);
	}
}
