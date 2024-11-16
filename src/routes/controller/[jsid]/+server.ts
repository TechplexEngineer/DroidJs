// src/routes/custom-event/+server.js
import { Joystick } from '$lib/joystick-linux/joystick';
import { produce } from 'sveltekit-sse';

export function POST({ params }) {
    return produce(async function start({ emit }) {
        const js = new Joystick(`/dev/input/${params.jsid}`);

        emit('message', JSON.stringify({ "status": "connected" }));
        js.on('update', (data) => {
            emit('message', JSON.stringify(data));
        });

        setInterval(() => {
            emit('message', JSON.stringify({ "status": "1" })); // this seems needed or we don't get a hearbeat
            emit('message', JSON.stringify({ "status": "Hearbeat" }));
        }, 500)

        return function cancel() {
            js.close();
        };
    });
}
