import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    const config = await locals.db.read();

    

    let servo = config.servos.find((s)=>s.name == params.name);

    let current = locals.servoMgr.getCurrentLocation(servo.channel);

    servo.current = current;

    return {
        servo: servo
    };
}) satisfies PageServerLoad;

export const actions = {
    setAngle: async ({ locals, request }) => {
        const data = await request.formData();
        const value = data.get('value')?.toString();
        const channel = data.get('channel')?.toString();
        if (typeof value == 'undefined' || typeof channel == 'undefined') {
            return;
        }
        console.log("chan value", parseInt(channel), parseInt(value));
        locals.servoMgr.setAngle(parseInt(channel), parseInt(value));
    },
    save: async ({ locals, request }) => {
        
        const data = await request.formData();
        console.log("save", data)
        const name = data.get('name')?.toString();
        const min = data.get('min')?.toString();
        const max = data.get('max')?.toString();
        const home = data.get('home')?.toString();
        if (typeof name == 'undefined' || typeof min == 'undefined' || typeof max == 'undefined' || typeof home == 'undefined') {
            return fail(400, { message: 'Missing required fields' });
        }
        let servo = { min: parseInt(min), max: parseInt(max), home: parseInt(home) };
        console.log(name, servo)
        await locals.config.updateServoByName(name, servo);
    }
} satisfies Actions;