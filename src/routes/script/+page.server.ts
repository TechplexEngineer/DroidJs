import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    return {
        files: await locals.scriptMgr.listScripts()
    };
}) satisfies PageServerLoad;