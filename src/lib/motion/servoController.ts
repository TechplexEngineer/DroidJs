import { clamp, mapRange } from '$lib/utils/math';
import type { PwmOutput } from './pwm';

export class ServoController { //need a unique one of these for each pwmControllerOutput
	pwmControllerOutput: PwmOutput;
	minPulseUs: number;
	maxPulseUs: number;
	frequencyHz: number;
	minAngle: number;
	maxAngle: number;

	servoLocationCache = new Map<number, number>(); //channel to angle

	constructor(pwmOut: PwmOutput, minPulseUs = 750, maxPulseUs = 2250, frequencyHz = 50, minAngle = 0, maxAngle = 180) {
		this.pwmControllerOutput = pwmOut;
		this.minPulseUs = minPulseUs;
		this.maxPulseUs = maxPulseUs;
		this.frequencyHz = frequencyHz;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
	}

	setAngle(channel: number, targetAngle: number, allowOutOfBounds = false) {
		if (!allowOutOfBounds) {
			targetAngle = clamp(targetAngle, this.minAngle, this.maxAngle);
		}
		const startingAngle = this.servoLocationCache.get(channel) || 0;
		this.servoLocationCache.set(channel, targetAngle);

		const pulseWidth = mapRange(targetAngle, this.minAngle, this.maxAngle, this.minPulseUs, this.maxPulseUs);

		const usPerSecond = 1_000_000;
		const oneCycleUs = usPerSecond / this.frequencyHz;

		const pca9685Min = 0;
		const pca9685Max = 4095;
		const onTime = 0;
		const offTime = mapRange(pulseWidth, 0, oneCycleUs, pca9685Min, pca9685Max);

		this.pwmControllerOutput.setPWM(channel, onTime, offTime);

		// disable the servo after it has moved
		// per sparkfun: the servo can move 60° at a speed of .16 seconds with no load
		// https://www.sparkfun.com/servos
		const waitTimeMs = Math.abs(startingAngle - targetAngle) / 60 * .16 * 1000;
		setTimeout(() => {
			this.disable(channel);
		}, waitTimeMs); //wait for the servo to move //@todo not sure how to determine this number

	}

	//.16 sec to miliseconds

	setAngleSlow(channel: number, targetAngle: number, timeMs: number) {
		const startTime = Date.now(); //time in ms
		const startingPos = this.servoLocationCache.get(channel) || 0;
		const id = setInterval(() => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTime;
			const progress = elapsedTime / timeMs;

			const currentAngle = mapRange(progress, 0, 1, startingPos, targetAngle);

			this.setAngle(channel, currentAngle >= targetAngle ? targetAngle : currentAngle);

			if (progress >= 1) {
				clearInterval(id); //is id this properly captured by the closure?
				this.disable(channel);
			}

		}, 50); //move in 50ms steps
	}

	disable(channel: number) {
		this.pwmControllerOutput.setPWM(channel, 0, 0);
	}
}




