// See https://kit.svelte.dev/docs/types#app

import type { SoundPlayer } from "$lib/sound/player";
import type { ScriptRunnerManager } from "$lib/script/ScriptRunnerManager";
import type { FileDb } from "$lib/db/jsondb";
import type { ServoController } from "$lib/motion/servoController";
import type { ConfigDb } from "$lib/db/configDb";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			soundPlayer: SoundPlayer,
			scriptMgr: ScriptRunnerManager,
			db: FileDb,
			config: ConfigDb
			servoMgr: ServoController,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
