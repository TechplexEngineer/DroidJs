import type { Joystick, JoystickMapper, jsEvent } from './joystick';

// Store the values from the joystick to allow easier access
export class JoystickCache {
	joystickCache: Record<string, any> = {};
	mapper;

	constructor(stick: Joystick, mapper: JoystickMapper) {
		this.joystickCache = {};
		this.mapper = mapper;

		stick.on('disconnect', () => {
			this.joystickCache = {};
		});

		stick.on('jserror', () => {
			this.joystickCache = {};
		});

		stick.on('update', (ev) => {
			this.add(ev);
		});
	}

	private add(ev: jsEvent) {
		this.joystickCache[`${ev.type}_${ev.number}`] = ev;
	}

	getAxis(axis: number): number {
		return this.joystickCache[`AXIS_${axis}`]?.value || 0;
	}
	getButton(button: number): boolean {
		return this.joystickCache[`BUTTON_${button}`]?.value!!;
	}

	getAxisByName(axisName: string): number {
		return this.getAxis(this.mapper.axisFromName(axisName));
	}
	getButtonByName(buttonName: string): boolean {
		return this.getButton(this.mapper.buttonFromName(buttonName));
	}
}
