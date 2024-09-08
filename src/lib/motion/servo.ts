import { clamp, mapRange } from '$lib/utils/math';
import type { PwmOutput } from './pwm';

export class ServoController {
	pwmControllerOutput: PwmOutput;
	minPulseUs: number;
	maxPulseUs: number;
	frequencyHz: number;
	minAngle: number;
	maxAngle: number;

	constructor(pwmOut: PwmOutput, minPulseUs = 750, maxPulseUs = 2250, frequencyHz = 50, minAngle = 0, maxAngle = 180) {
		this.pwmControllerOutput = pwmOut;
		this.minPulseUs = minPulseUs;
		this.maxPulseUs = maxPulseUs;
		this.frequencyHz = frequencyHz;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
	}

	setAngle(channel: number, angle: number) {
		// angle = clamp(angle, this.minAngle, this.maxAngle); // not sure if we should do this?

		const pulseWidth = mapRange(angle, this.minAngle, this.maxAngle, this.minPulseUs, this.maxPulseUs);

		const usPerSecond = 1_000_000;
		const oneCycleUs = usPerSecond / this.frequencyHz;

		const pca9685Min = 0;
		const pca9685Max = 4095;
		const onTime = 0;
		const offTime = mapRange(pulseWidth, 0, oneCycleUs, pca9685Min, pca9685Max);

		this.pwmControllerOutput.setPWM(channel, onTime, offTime);
	}
}

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

		const pca9685Min = 0;
		const pca9685Max = 4095;
		const onTime = 0;
		const offTime = mapRange(pulseWidth, 0, oneCycleUs, pca9685Min, pca9685Max);

		this.pwmControllerOutput.setPWM(channel, onTime, offTime);
	}
}
