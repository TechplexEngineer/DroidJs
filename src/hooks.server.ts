import { building } from '$app/environment';
import { startup } from '$lib/startup';
import type { Handle } from '@sveltejs/kit';

process.on('sveltekit:shutdown', async (reason) => {
	console.log('sveltekit:shutdown');
	process.exit(0);
});

let appLocals: any = null;

export const handle: Handle = async ({ event, resolve }) => {
	if (building) {
		console.log('Building, skipping hardware startup');
	} else {
		if (!appLocals) {
			appLocals = await startup();
		}
		event.locals = appLocals;
	}

	const response = await resolve(event);
	return response;
};