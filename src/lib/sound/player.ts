import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import uFuzzy from '@leeoniya/ufuzzy';

const isMac = os.type() === 'Darwin' || os.type().indexOf('Windows') > -1;

export class SoundPlayer {
    private soundDirectory: string;
    private process: ChildProcessWithoutNullStreams | null = null
    private matcher: uFuzzy;

    //eg. /home/pi/r2_control/sounds/
    constructor(soundDirectory: string) {
        this.soundDirectory = soundDirectory;
        this.matcher = new uFuzzy({});
    }

    // HUM__014.mp3
    async playSound(filename: string, volume: number) {
        console.log('Playing sound', filename, volume);
        
        return new Promise<void>((resolve, reject) => {
            this.stop();

            const filePath = path.join(this.soundDirectory, filename);
            if (!isMac) {
                this.process = spawn('mpg321', ["-q", filePath, '-g', `${volume}`]);
            } else {
                this.process = spawn('afplay', [filePath, '-v', `${volume}`]);
            }

            let stdOut: string[] = [];
            let stdErr: string[] = [];

            this.process.stdout.on('data', (data) => {
                stdOut.push(data);
            });

            this.process.stderr.on('data', (data) => {
                stdErr.push(data);
            });

            this.process.on('close', (code) => {
                if (code !== 0) {
                    console.log(`child process exited with code ${code}`);
                    console.log(stdOut.join('\n'));
                    console.error(stdErr.join('\n'));
                }

                this.process = null;
                resolve();
            });

            this.process.on('error', (err) => {
                console.log(`Error playing '${filePath}'` + err);

                this.process = null;
                resolve();
            });
        });
    }

    stop() {
        if (this.process !== null) {
            this.process.kill('SIGTERM');
            this.process = null;
        }
    }

    async listSounds() {
        console.log('Listing sounds in', this.soundDirectory);
        const listing = await fs.readdir(this.soundDirectory, { recursive: true });
        return listing.filter((file) => file.toLowerCase().endsWith('.mp3'));
    }

    async playRandomSound(category: string | null, volume: number, ) {
        console.log('Playing random sound', category, volume);
        
        const sounds = await this.listSounds();

        if (category == null || category== "any") {
            const randomIndex = Math.floor(Math.random() * sounds.length);
            const randomSound = sounds[randomIndex];
            return await this.playSound(randomSound, volume);
        }

        const grouped = groupSounds(sounds);
        const groups = Object.keys(grouped);
        const matches = this.matcher.filter(groups, category);
        if (!matches || matches.length === 0) {
            console.log(`No matches for ${category}`);
            return;
        }

        const groupName = groups[matches[0]];

        if (groupName) {
            const randomIndex = Math.floor(Math.random() * grouped[groupName].length);
            const randomSound = grouped[groupName][randomIndex];
            await this.playSound(`${groupName}/${randomSound}`, volume);
        }
    }



}

export const groupSounds = (sounds: string[]) => {

    // data contains a list of files and the directory they are store in
    // split the filename on / and group by prefix
    // SENT/SENT_001.mp3 => {'SENT': ['SENT_001.mp3']}
    // SOUND/SENT/SENT_001.mp3 => {'SOUND': {'SENT': ['SENT_001.mp3']}}

    const grouped = sounds.reduce(
        (acc, file) => {
            const parts = file.split('/');
            // console.log('parts', parts);
            if (parts.length == 1) {
                if (!acc['']) {
                    acc[''] = [];
                }
                acc[''].push(parts[0]);
                return acc;
            } else {
                const [prefix, ...rest] = parts;
                if (!acc[prefix]) {
                    acc[prefix] = [];
                }
                acc[prefix].push(rest.join('/'));
                return acc;
            }
        },
        {} as Record<string, string[]>
    );
    return grouped;
}