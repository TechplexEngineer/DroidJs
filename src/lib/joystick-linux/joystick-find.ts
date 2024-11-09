import * as fs from 'fs/promises';
import {
	getAxisMap,
	getButtonMap,
	getDeviceName,
	getNumAxes,
	getNumButtons
} from './joystick-ioctl';

const exampleResult = [
	{
		"number": 0,
		"path": "/dev/input/js0",
		"name": "Logitech Gamepad F310",
		"numButtons": 11,
		"numAxes": 8,
		"buttonMap": {
		  "0": "BtnA",
		  "1": "BtnB",
		  "2": "BtnX",
		  "3": "BtnY",
		  "4": "BtnTL",
		  "5": "BtnTR",
		  "6": "BtnSelect",
		  "7": "BtnStart",
		  "8": "BtnMode",
		  "9": "BtnThumbL",
		  "10": "BtnThumbR"
		},
		"axisMap": {
		  "0": "X",
		  "1": "Y",
		  "2": "Z",
		  "3": "Rx",
		  "4": "Ry",
		  "5": "Rz",
		  "6": "Hat0X",
		  "7": "Hat0Y"
		}
	  },
	  {
		"number": 1,
		"path": "/dev/input/js1",
		"name": "Sony Navigation Controller",
		"numButtons": 12,
		"numAxes": 3,
		"buttonMap": {
		  "0": "BtnA",
		  "1": "BtnB",
		  "2": "BtnX",
		  "3": "BtnY",
		  "4": "BtnTL",
		  "5": "BtnTL2",
		  "6": "BtnMode",
		  "7": "BtnThumbL"
		},
		"axisMap": {
		  "0": "X",
		  "1": "Y",
		  "2": "Z"
		}
	  }
	  
	  
];

export const listJoysticks = async () => {
	const devices = await fs.readdir('/dev/input');
	const joysticks = devices.filter((d) => d.startsWith('js'));

	return Promise.all(
		joysticks.map(async (j) => {
			const fh = await fs.open(`/dev/input/${j}`, 'r');

			const data = {
				number: parseInt(j.slice(2)),
				path: `/dev/input/${j}`,
				name: getDeviceName(fh.fd),
				numButtons: getNumButtons(fh.fd),
				numAxes: getNumAxes(fh.fd),
				buttonMap: getButtonMap(fh.fd),
				axisMap: getAxisMap(fh.fd)
			};
			console.log(JSON.stringify(data, null, 2));
			fh.close();
			return data;
		})
	);
	

	// fs.open(DevicePath, 'r', function (err, fd) {
	// 		if (err) {
	// 			throw err;
	// 		}

	// 		const version = getDriverVersion(fd);
	// 		console.log(`Driver version is ${version}.`);

	// 		const axes = getNumAxes(fd);
	// 		console.log(`Number of axes is ${axes}.`);

	// 		const buttons = getNumButtons(fd);
	// 		console.log(`Number of buttons is ${buttons}.`);

	// 		const name = getDeviceName(fd);
	// 		console.log(`Device name is '${name}'.`);

	// 		const map = getAxisMap(fd, axes);
	// 		console.log(`Axis map is:`, map);

	// 		const buttonMap = getButtonMap(fd, buttons);
	// 		console.log(`Button map is:`, buttonMap);

	// 		console.log('fd', fd);

	// 		const fileStream = createReadStream('IGNORED', { fd: fd });
	// 		fileStream.on('error', (e) => {
	// 			if (e.code === 'ENODEV') {
	// 				console.log('disconnect');
	// 			} else {
	// 				console.log('jserror', e);
	// 			}
	// 			/* // wait a bit to reconnect on error
	// setTimeout(() => {
	//   this.initReadStream(devicePath);
	// }, 50); */
	// 		});

	// 		fileStream.pipe(new JoystickStream()).on('data', (b) => onData(b));

	// 		//   fs.close(fd);
	// 	});

	return joysticks;
};
