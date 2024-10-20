import { clamp, mapRange } from '$lib/utils/math';
import type { PwmOutput } from './pwm';

export class ServoController { //need a unique one of these for each pwmControllerOutput
	private pwmControllerOutput: PwmOutput;
	private minPulseUs: number;
	private maxPulseUs: number;
	private frequencyHz: number;
	private minAngle: number;
	private maxAngle: number;

	servoLocationCache = new Map<number, number>(); //channel to angle

	constructor(pwmOut: PwmOutput, minPulseUs = 1000, maxPulseUs = 2000, frequencyHz = 50, minAngle = 0, maxAngle = 180) {
		this.pwmControllerOutput = pwmOut;
		this.minPulseUs = minPulseUs;
		this.maxPulseUs = maxPulseUs;
		this.frequencyHz = frequencyHz;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
	}

	private setAngleNoDisable(channel: number, targetAngle: number, allowOutOfBounds = false) {
		if (!allowOutOfBounds) {
			targetAngle = clamp(targetAngle, this.minAngle, this.maxAngle);
		}
		
		this.servoLocationCache.set(channel, targetAngle);

		const pulseWidth = mapRange(targetAngle, this.minAngle, this.maxAngle, this.minPulseUs, this.maxPulseUs);
		
		const usPerSecond = 1_000_000;
		const oneCycleUs = usPerSecond / this.frequencyHz;

		const pca9685Min = 0;
		const pca9685Max = 4095;
		const onTime = 0;
		const offTime = Math.round(mapRange(pulseWidth, 0, oneCycleUs, pca9685Min, pca9685Max));

		this.pwmControllerOutput.setPWM(channel, onTime, offTime);
	}

	public setAngle(channel: number, targetAngle: number, allowOutOfBounds = false) {
		const startingAngle = this.servoLocationCache.get(channel) || 0;

		this.setAngleNoDisable(channel, targetAngle, allowOutOfBounds);

		// disable the servo after it has moved
		// per sparkfun: the servo can move 60° at a speed of .16 seconds with no load
		// https://www.sparkfun.com/servos
		const waitTimeMs = Math.max(Math.abs(startingAngle - targetAngle) / 60 * .16 * 1000, 100) + 250;
		setTimeout(() => {
			this.disable(channel);
		}, waitTimeMs); //wait for the servo to move
	}

	public setAngleSlow(channel: number, targetAngle: number, timeMs: number) {
		const startTime = Date.now(); //time in ms
		const startingPos = this.servoLocationCache.get(channel) || 0;
		const id = setInterval(() => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTime;
			const progress = elapsedTime / timeMs;

			const currentAngle = mapRange(progress, 0, 1, startingPos, targetAngle);

			this.setAngleNoDisable(channel, currentAngle >= targetAngle ? targetAngle : currentAngle);

			if (progress >= 1) {
				clearInterval(id); //is id this properly captured by the closure?
				this.disable(channel);
			}

		}, 25); //move in _ms steps
	}

	public disable(channel: number) {
		this.pwmControllerOutput.setPWM(channel, 0, 0);
	}

	public getCurrentLocation(channel: number): number {
		return this.servoLocationCache.get(channel) || 0;
	}
}




