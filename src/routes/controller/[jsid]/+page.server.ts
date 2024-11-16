import { listJoysticks } from '$lib/joystick-linux/joystick-find';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const joysticks = await listJoysticks();

    return {
        joysticks: joysticks
    };
}) satisfies PageServerLoad;

export const actions = {
    event: async ({ locals, request }) => {
        const data = await request.formData();
        console.log("data", data)
        // const filename = data.get('filename')?.toString();
        // if (!filename) {
        //     return;
        // }
        // await locals.soundPlayer.playSound(filename);
        // return { message: filename };
    }
} satisfies Actions;