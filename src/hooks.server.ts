import { building } from '$app/environment';
import { startup } from '$lib/startup';

if (!building) {
	startup();
}
