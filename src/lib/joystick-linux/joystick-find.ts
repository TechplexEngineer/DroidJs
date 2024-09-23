import * as fs from 'fs/promises';

export const listJoysticks = async () => {
	const devices = await fs.readdir('/dev/input');
	const joysticks = devices.filter((d) => d.startsWith('js'));

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
