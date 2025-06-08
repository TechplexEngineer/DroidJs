import * as fs from 'fs/promises';
import * as js from './joystick-ioctl';

export const listJoysticks = async (): Promise<string[] | {
	number: number;
	path: string;
	name: string;
	numButtons: number;
	numAxes: number;
	buttonMap: Record<number, string>;
	axisMap: Record<number, string>;
}[]> => {
	const devices = await fs.readdir('/dev/input');
	const joysticks = devices.filter((d) => d.startsWith('js'));

	return Promise.all(
		joysticks.map(async (j) => {
			const fh = await fs.open(`/dev/input/${j}`, 'r');

			const data = {
				number: parseInt(j.slice(2)),
				path: `/dev/input/${j}`,
				name: js.getDeviceName(fh.fd),
				numButtons: js.getNumButtons(fh.fd),
				numAxes: js.getNumAxes(fh.fd),
				buttonMap: js.getButtonMap(fh.fd),
				axisMap: js.getAxisMap(fh.fd)
			};
			console.log(JSON.stringify(data, null, 2));
			fh.close();
			return data;
		})
	);
};
