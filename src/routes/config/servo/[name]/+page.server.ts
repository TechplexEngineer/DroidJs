import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    const config = await locals.db.read();

    console.log('params.name', params.name);

    // locals.servos.getCurrentLocaton(params.channel);

    return {
        servo: config.servos.find((s)=>s.name == params.name) || []
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
        locals.servoMgr.setAngle(parseInt(channel), parseInt(value));
    }
} satisfies Actions;