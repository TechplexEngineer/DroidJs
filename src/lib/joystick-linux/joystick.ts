import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { JoystickStream } from './joystick-stream.js';
import { parseEvent } from './parseEvent.js';

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

	private initReadStream(devicePath: string) {
		try {
			const fileStream = createReadStream(devicePath);
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
			console.log('error tc', error);
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
}
