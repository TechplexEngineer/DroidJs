import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {
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
        locals.scriptMgr.runScript(filename);
    },
    
} satisfies Actions;