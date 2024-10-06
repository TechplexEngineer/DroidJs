import { building } from '$app/environment';
import { startup } from '$lib/startup';
import type { Handle } from '@sveltejs/kit';

process.on('sveltekit:shutdown', async (reason) => {
	console.log('sveltekit:shutdown');
	process.exit(1);
});

// Cache the locals so we don't get new ones on every request
let appLocalsCache: Promise<App.Locals> | null = null;
if (building) {
	console.log('Building, skipping hardware startup');
} else {
	if (!appLocalsCache) {
		appLocalsCache = startup();
	}

}


export const handle: Handle = async ({ event, resolve }) => {
	if (appLocalsCache !== null) {
		event.locals = await appLocalsCache;
	}

	const response = await resolve(event);
	return response;
};