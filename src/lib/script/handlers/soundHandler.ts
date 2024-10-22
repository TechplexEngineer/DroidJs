import { groupSounds } from "$lib/sound/groupSounds";
import { type SoundPlayer } from "$lib/sound/player";
import type { Handler } from "./iHandler";
import path from 'path';


export class SoundHandler implements Handler {
    private player: SoundPlayer;

    constructor(player: SoundPlayer) {
        this.player = player;

    }

    async handler(args: string[], handlerName: string): Promise<void> {
        if (args.length === 1) {
            const fileName = args[0];
            this.player.playSoundMatch(fileName);
            return;
        }
        if (args.length === 2 && args[0].toLowerCase() == "random") {
            const sounds = await this.player.listSounds();
            const groups = groupSounds(sounds);
            if (!Object.keys(groups).includes(args[1])) {
                console.log('Unknown sound group: ' + args[1]);
                return;
            }
            const group = groups[args[1]];
            const randomIndex = Math.floor(Math.random() * group.length);
            const sound = group[randomIndex];
            this.player.playSound(path.join(args[1], sound));
            return;
        }
        console.error(`Unknown command: ${handlerName},${args.join(',')}`)

        await this.player.listSounds()
        throw new Error("Method not implemented.");
    }

}