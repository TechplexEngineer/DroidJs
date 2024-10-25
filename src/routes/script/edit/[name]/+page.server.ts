import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {

    return {
        script: await locals.scriptMgr.getScript(params.name)
    };
}) satisfies PageServerLoad;

export const actions = {
    save: async ({ locals, request, params }) => {
        const data = await request.formData();
        const script = data.get('script')?.toString();
        console.log(script, params.name);

        if (!script) {
            return;
        }
        locals.scriptMgr.updateScript(params.name, script);
    }

} satisfies Actions;