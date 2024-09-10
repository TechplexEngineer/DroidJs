import { building } from '$app/environment';
import { startup } from '$lib/startup';
import type { Handle } from '@sveltejs/kit';



let startupPromise = startup();

export const handle: Handle = async ({ event, resolve }) => {
	const { soundPlayer, db } = await startupPromise;
	event.locals.soundPlayer = soundPlayer;
	event.locals.db = db;

	const response = await resolve(event);
	return response;
};