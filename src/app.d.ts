// See https://kit.svelte.dev/docs/types#app

import type { SoundPlayer } from "$lib/sound/player";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			soundPlayer: SoundPlayer;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
