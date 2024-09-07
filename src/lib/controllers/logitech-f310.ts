import type { JoystickMapper, jsEvent, namedJsEvent } from '$lib/joystick-linux/joystick';
import { mapRange } from '$lib/utils/math';

const axisMap: Record<number, string> = {
	0: 'LEFT_STICK_X',
	1: 'LEFT_STICK_Y',
	2: 'LEFT_TRIGGER',
	3: 'RIGHT_STICK_X',
	4: 'RIGHT_STICK_Y',
	5: 'RIGHT_TRIGGER',
	6: 'DPAD_X',
	7: 'DPAD_Y'
};
const reverseAxisMap: Record<string, number> = Object.entries(axisMap).reduce(
	(acc, [key, value]) => {
		acc[value] = parseInt(key);
		return acc;
	},
	{} as Record<string, number>
);

const buttonMap: Record<number, string> = {
	0: 'A',
	1: 'B',
	2: 'X',
	3: 'Y',
	4: 'LEFT_BUMPER',
	5: 'RIGHT_BUMPER',
	6: 'BACK',
	7: 'START',
	8: 'LEFT_STICK',
	9: 'RIGHT_STICK'
};
const reverseButtonMap: Record<string, number> = Object.entries(buttonMap).reduce(
	(acc, [key, value]) => {
		acc[value] = parseInt(key);
		return acc;
	},
	{} as Record<string, number>
);

function getButtonName(ev: jsEvent) {
	if (ev.type === 'AXIS') {
		return axisMap[ev.number];
	}

	if (ev.type === 'BUTTON') {
		return buttonMap[ev.number];
	}
}

function logitechF310MapperFn(ev: jsEvent): namedJsEvent {
	const event: namedJsEvent = { ...ev, name: getButtonName(ev) || 'UNKNOWN' };

	if (event.name === 'RIGHT_TRIGGER' || event.name === 'LEFT_TRIGGER') {
		event.value = mapRange(event.value, -32767, 32767, 0, 1);
	}

	// convert axis values to -1 to 1
	if (event.type === 'AXIS' && event.name !== 'RIGHT_TRIGGER' && event.name !== 'LEFT_TRIGGER') {
		event.value = mapRange(event.value, -32767, 32767, -1, 1);
	}

	return event;
}

export const LogitechF310Mapper: JoystickMapper = {
	eventMapper(ev: jsEvent): namedJsEvent {
		return logitechF310MapperFn(ev);
	},
	axisFromName(axisName: string): number {
		return reverseAxisMap[axisName];
	},
	buttonFromName(buttonName: string): number {
		return reverseButtonMap[buttonName];
	},
	nameFromAxis(axis: number): string {
		return axisMap[axis];
	},
	nameFromButton(button: number): string {
		return buttonMap[button];
	},
	axisMap,
	reverseAxisMap,
	buttonMap,
	reverseButtonMap
};
