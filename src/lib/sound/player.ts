import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import uFuzzy from '@leeoniya/ufuzzy';
import { clamp } from '$lib/utils/math';
import { groupSounds } from './groupSounds';

const isMac = os.type() === 'Darwin' || os.type().indexOf('Windows') > -1;

export class SoundPlayer {
    private soundDirectory: string;
    private process: ChildProcessWithoutNullStreams | null = null
    private matcher: uFuzzy;
    private volume: number = 75; //@todo load from config file, save to config file

    //eg. /home/pi/r2_control/sounds/
    constructor(soundDirectory: string) {
        this.soundDirectory = soundDirectory;
        this.matcher = new uFuzzy({});
    }

    public setVolume(volume: number) {
        this.volume = clamp(volume, 0, 100);
        console.log('Volume set to', this.volume);
    }
    public getVolume() {
        return this.volume;
    }


    // HUM__014.mp3
    async playSound(filename: string) {


        return new Promise<void>((resolve, _reject) => {
            this.stop();

            const filePath = path.join(this.soundDirectory, filename);
            console.log('Playing sound', filePath, this.volume);
            if (!isMac) {
                this.process = spawn('mpg321', ["-q", filePath, '-g', `${this.volume}`]);
                // console.log('mpg321', ["-q", filePath, '-g', `${this.volume}`])
            } else {
                //afplay is the macos sound player
                this.process = spawn('afplay', [filePath, '-v', `${this.volume}`]);
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

    async playSoundMatch(filename: string) {
        const sounds = await this.listSounds();
        const matches = this.matcher.filter(sounds, filename);
        if (!matches || matches.length === 0) {
            console.log(`No matches for ${filename}`);
            return;
        }
        this.playSound(sounds[matches[0]]);
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

    async playRandomSound(category: string | null) {
        console.log('Playing random sound', category);

        const sounds = await this.listSounds();

        if (category == null || category == "any") {
            const randomIndex = Math.floor(Math.random() * sounds.length);
            const randomSound = sounds[randomIndex];
            return await this.playSound(randomSound);
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
            await this.playSound(`${groupName}/${randomSound}`);
        }
    }
}

