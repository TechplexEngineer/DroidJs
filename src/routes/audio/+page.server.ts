import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return {
        files: await locals.soundPlayer.listSounds()
    };
}) satisfies PageServerLoad;


export const actions = {
    play: async ({ locals, request }) => {
        const data = await request.formData();
        const filename = data.get('filename')?.toString();
        if (!filename) {
            return;
        }
        locals.soundPlayer.playSound(filename);
    },
    stop: async ({ locals, request }) => {
        console.log('stop');
        locals.soundPlayer.stop();
    },
} satisfies Actions;