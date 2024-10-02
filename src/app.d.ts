// See https://kit.svelte.dev/docs/types#app

import type { FileDb } from "$lib/db/jsondb";
import type { ScriptRunnerManager } from "$lib/script/ScriptRunnerManager";
import type { SoundPlayer } from "$lib/sound/player";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			soundPlayer: SoundPlayer;
			scriptMgr: ScriptRunnerManager,
			db: FileDb
			soundPlayer: player,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
