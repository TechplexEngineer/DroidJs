import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { JoystickStream } from './joystick-stream.js';
import { parseEvent } from './parseEvent.js';
import * as fs from 'node:fs/promises';
import os from 'os';
// import ioctl from 'ioctl';
// import {
// 	getAxisMap,
// 	getButtonMap,
// 	getDeviceName,
// 	getDriverVersion,
// 	getNumAxes,
// 	getNumButtons
// } from './joystick-ioctl.js';

export interface namedJsEvent extends jsEvent {
	name: string;
}

export interface JoystickMapper {
	axisFromName(axiseName: string): number;
	buttonFromName(buttonName: string): number;
	nameFromAxis(axis: number): string;
	nameFromButton(button: number): string;
	eventMapper(ev: jsEvent): namedJsEvent;

	axisMap: Record<number, string>;
	reverseAxisMap: Record<string, number>;
	buttonMap: Record<number, string>;
	reverseButtonMap: Record<string, number>;
}

export interface jsEvent {
	isInitial: boolean;
	number: number;
	time: number;
	type: string;
	value: number;
}

type jsOptions = {
	mappingFn?: (ev: jsEvent) => jsEvent;
	includeInit?: boolean;
};

interface JsEvents {
	disconnect: [];
	jserror: [Error]; //jserror instead of error as "error" crashes the app
	update: [jsEvent];
}

export class Joystick extends EventEmitter<JsEvents> {
	mappingFn;
	includeInit;
	fileHandle: fs.FileHandle | undefined = undefined;

	/**
	 *
	 * @param {string} devicePath e.g. "/dev/input/js0"
	 * @param options
	 * @param {function} options.mappingFn function to re-map event data (e.g. add button names of your specific device)
	 * @param {boolean} options.includeInit include events that report initial joystick state
	 */
	constructor(devicePath: string, options: jsOptions = {}) {
		super();
		this.mappingFn = options.mappingFn;
		this.includeInit = options.includeInit;

		this.initReadStream(devicePath);
	}

	private async initReadStream(devicePath: string) {
		try {
			this.fileHandle = await fs.open(devicePath);

			const fileStream = createReadStream('IGNORED', { fd: this.fileHandle.fd });
			fileStream.on('error', (e) => {
				if ((e as any).code === 'ENODEV') {
					this.emit('disconnect');
				} else {
					this.emit('jserror', e);
				}
				// wait a bit to reconnect on error
				setTimeout(() => {
					this.initReadStream(devicePath);
				}, 50);
			});

			fileStream.pipe(new JoystickStream()).on('data', (b) => this.onData(b));
		} catch (error) {
			console.log('JS Error Init Read Stream', error);
			this.fileHandle?.close();
			if (os.platform() == "linux") {
				setTimeout(() => {
					this.initReadStream(devicePath);
				}, 500);
			}
		}
	}

	private onData(buff: Buffer) {
		const ev = parseEvent(buff);

		if (ev.type === 'unknown') {
			console.log('ev type unknown', ev.type);
			return;
		}

		if (ev.isInitial === true && this.includeInit !== true) {
			return;
		}

		if (typeof this.mappingFn === 'function') {
			this.emit('update', this.mappingFn(ev));
		} else {
			this.emit('update', ev);
		}
	}

	public close() {
		this.fileHandle?.close();
	}

	public injectEvent(ev: jsEvent) {
		this.emit('update', ev);
	}

	// public getDriverVersion() {
	// 	if (!this.fileHandle) {
	// 		throw new Error('File handle not initialized');
	// 	}
	// 	return getDriverVersion(this.fileHandle.fd);
	// }
	// public getNumAxes() {
	// 	if (!this.fileHandle) {
	// 		throw new Error('File handle not initialized');
	// 	}
	// 	return getNumAxes(this.fileHandle.fd);
	// }
	// public getNumButtons() {
	// 	if (!this.fileHandle) {
	// 		throw new Error('File handle not initialized');
	// 	}
	// 	return getNumButtons(this.fileHandle.fd);
	// }
	// public getDeviceName() {
	// 	if (!this.fileHandle) {
	// 		throw new Error('File handle not initialized');
	// 	}
	// 	return getDeviceName(this.fileHandle.fd);
	// }
	// public getAxisMap() {
	// 	if (!this.fileHandle) {
	// 		throw new Error('File handle not initialized');
	// 	}
	// 	return getAxisMap(this.fileHandle.fd);
	// }
	// public getButtonMap() {
	// 	if (!this.fileHandle) {
	// 		throw new Error('File handle not initialized');
	// 	}
	// 	return getButtonMap(this.fileHandle.fd);
	// }
}
