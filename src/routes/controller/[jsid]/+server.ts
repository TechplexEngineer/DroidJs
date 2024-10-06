// // src/routes/custom-event/+server.js
// import { Joystick } from '$lib/joystick-linux/joystick';
// import { produce } from 'sveltekit-sse';

// export function POST({ params }) {
// 	return produce(async function start({ emit }) {
// 		const js = new Joystick(`/dev/input/${params.jsid}`);
// 		js.on('update', (data) => {
// 			emit('message', JSON.stringify(data));
// 		});

// 		return function cancel() {
// 			js.close();
// 		};
// 		// while (true) {
// 		// 	// const { error } = emit('message', `the time is ${Date.now()}`);
// 		// 	// if (error) {
// 		// 	// 	return;
// 		// 	// }
// 		// 	// await delay(1000);
// 		// }
// 	});
// }
