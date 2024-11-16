// from joystick.h in linux kernel

import ioctl from 'ioctl';
import { axis_names, AXMAP_SIZE, BTN_MISC, BTNMAP_SIZE, button_names, IOCTL } from './joystick-ioctl-constants';

export const getDriverVersion = (fd: number) => {
	const buffer = Buffer.alloc(4);

	var ret = ioctl(fd, IOCTL.JSIOCGVERSION, buffer);
	if (ret < 0) {
		throw new Error('ioctl failed');
	}

	const version = buffer.readUInt32LE();

	return `${version >> 16}.${(version >> 8) & 0xff}.${version & 0xff}`;
};

export const getNumAxes = (fd: number) => {
	const buffer = Buffer.alloc(4);

	var ret = ioctl(fd, IOCTL.JSIOCGAXES, buffer);
	if (ret < 0) {
		throw new Error('ioctl failed');
	}

	const numAxes = buffer.readUInt8(0);

	return numAxes;
};

export const getNumButtons = (fd: number) => {
	const buffer = Buffer.alloc(4);

	var ret = ioctl(fd, IOCTL.JSIOCGBUTTONS, buffer);
	if (ret < 0) {
		throw new Error('ioctl failed');
	}

	const numButtons = buffer.readUInt8(0);

	return numButtons;
};

export const getDeviceName = (fd: number) => {
	const buffer = Buffer.alloc(256);

	var ret = ioctl(fd, IOCTL.JSIOCGNAME256, buffer);
	if (ret < 0) {
		throw new Error('ioctl failed');
	}

	const name = buffer.toString().replace(/\0.*$/g, '');

	return name;
};

export const getAxisMap = (fd: number) => {
	const buffer = Buffer.alloc(AXMAP_SIZE);

	var ret = ioctl(fd, IOCTL.JSIOCGAXMAP, buffer);
	if (ret < 0) {
		throw new Error('ioctl failed');
	}

	const axes = getNumAxes(fd);

	const map: Record<number, string> = {};

	for (let i = 0; i < axes; i++) {
		map[i] = axis_names[buffer.readUInt8(i)];
	}

	return map;
};

export const getButtonMap = (fd: number) => {
	const buffer = Buffer.alloc(BTNMAP_SIZE * 2);

	// the IOCTL.JSIOCGBTNMAP_LARGE is only available on newer kernels
	// Here is what JSTEST does to support older kernels https://salsa.debian.org/debian/joystick/-/blob/master/utils/axbtnmap.c?ref_type=heads#L37-53
	var ret = ioctl(fd, IOCTL.JSIOCGBTNMAP_LARGE, buffer);
	if (ret < 0) {
		throw new Error('ioctl failed');
	}

	const buttons = getNumButtons(fd);

	const map: Record<number, string> = {};

	for (let i = 0; i < buttons * 2; i += 2) {
		map[i / 2] = button_names[buffer.readInt16LE(i) - BTN_MISC];
	}

	return map;
};
