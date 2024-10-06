import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const isMac = os.type() === 'Darwin' || os.type().indexOf('Windows') > -1;

export class SoundPlayer {
    soundDirectory: string;
    process: ChildProcessWithoutNullStreams | null = null

    //eg. /home/pi/r2_control/sounds/
    constructor(soundDirectory: string) {
        this.soundDirectory = soundDirectory;
    }

    // HUM__014.mp3
    async playSound(filename: string, volume = 50) {
        return new Promise<void>((resolve, reject) => {
            this.stop();

            const filePath = path.join(this.soundDirectory, filename);
            console.log('Playing:', filePath);
            if (isMac) {
                this.process = spawn('afplay', [filePath, '-v', `${volume}`]);
            } else {
                this.process = spawn('mpg321', ["-q", filePath, '-g', `${volume}`]);
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
        const listing = await fs.readdir(this.soundDirectory, { recursive: true });
        return listing.filter((file) => file.endsWith('.mp3'));
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