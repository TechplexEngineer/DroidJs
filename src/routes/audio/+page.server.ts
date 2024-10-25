import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return {
        files: await locals.soundPlayer.listSounds(),
        volume: locals.soundPlayer.getVolume()
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
    setVolume: async ({ locals, request }) => {
        const data = await request.formData();
        const volume = data.get('volume')?.toString();
        if (!volume) {
            return;
        }
        locals.soundPlayer.setVolume(parseInt(volume));
    },
    playRandom: async ({ locals, request }) => {
        const data = await request.formData();
        const cagegory = data.get('category')?.toString();
        if (!cagegory) {
            return fail(400, { message: "category is required" });
        }
        return { message: await locals.soundPlayer.playRandomSound(cagegory) };
    }
} satisfies Actions;