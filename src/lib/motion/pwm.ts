import { delay } from '$lib/utils/delay';
import type { PromisifiedBus } from 'i2c-bus';

export interface PwmOutput {
	setPWM(channel: number, pulseon: number, pulseoff: number): any;
}

export class PCA9685 implements PwmOutput {
	address: number;
	connection: PromisifiedBus;

	constructor(connection: PromisifiedBus, address = 0x40) {
		this.connection = connection;
		this.address = address;
	}

	static MODE1 = 0x00;
	static PRESCALE = 0xfe;
	static SUBADR1 = 0x02;
	static SUBADR2 = 0x03;
	static SUBADR3 = 0x04;
	static LED0_ON_L = 0x06;
	static LED0_ON_H = 0x07;
	static LED0_OFF_L = 0x08;
	static LED0_OFF_H = 0x09;
	static ALLLED_ON_L = 0xfa;
	static ALLLED_ON_H = 0xfb;
	static ALLLED_OFF_L = 0xfc;
	static ALLLED_OFF_H = 0xfd;

	async init() {
		await this.connection.writeByte(this.address, PCA9685.MODE1, 0x00);
		await this.connection.writeByte(this.address, PCA9685.ALLLED_OFF_H, 0x10);
	}

	async stop() {
		this.connection.writeByte(this.address, PCA9685.ALLLED_OFF_H, 0x10);
	}

	// frequency must be between 40 and 1000 Hz
	async setPWMFreq(frequency: number) {
		var prescaleval = 25_000_000;
		prescaleval /= 4096.0;
		prescaleval /= frequency;
		prescaleval -= 1.0;
		var prescale = Math.floor(prescaleval * 1.0 + 0.5);

		const oldMode = await this.connection.readByte(this.address, PCA9685.MODE1);

		const newMode = (oldMode & 0x7f) | 0x10; // sleep
		await this.connection.writeByte(this.address, PCA9685.MODE1, newMode);

		await this.connection.writeByte(this.address, PCA9685.PRESCALE, Math.floor(prescale));

		await this.connection.writeByte(this.address, PCA9685.MODE1, oldMode);

		await delay(100);

		await this.connection.writeByte(this.address, PCA9685.MODE1, oldMode | 0x80);
	}

	async setPWM(channel: number, pulseon: number, pulseoff: number) {
		await this.connection.writeByte(this.address, PCA9685.LED0_ON_L + 4 * channel, pulseon & 0xff);
		await this.connection.writeByte(this.address, PCA9685.LED0_ON_H + 4 * channel, pulseon >> 8);
		await this.connection.writeByte(
			this.address,
			PCA9685.LED0_OFF_L + 4 * channel,
			pulseoff & 0xff
		);
		await this.connection.writeByte(this.address, PCA9685.LED0_OFF_H + 4 * channel, pulseoff >> 8);
	}
}
