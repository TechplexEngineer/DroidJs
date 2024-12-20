import { listJoysticks } from '$lib/joystick-linux/joystick-find';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const joysticks = await listJoysticks();

    return {
        joysticks: joysticks
    };
}) satisfies PageServerLoad;
