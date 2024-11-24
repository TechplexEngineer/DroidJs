import { delay } from '$lib/utils/delay';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return {
        files: await locals.scriptMgr.listScripts()
    };
}) satisfies PageServerLoad;

export const actions = {
    run: async ({ locals, request }) => {
        const data = await request.formData();
        const filename = data.get('filename')?.toString();
        if (!filename) {
            return;
        }
        console.log('Running script:', filename);
        await locals.scriptMgr.runScript(filename);
    },
    stop: async ({ locals }) => {
        locals.scriptMgr.stopAllScripts();
        await delay(250); // need to wait for current script loops to stop
    }

} satisfies Actions;