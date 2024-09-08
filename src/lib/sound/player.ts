import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs/promises';
import path from 'path';


export class SoundPlayer {
    soundDirectory: string;
    process: ChildProcessWithoutNullStreams | null = null

    // /home/pi/r2_control/sounds/
    constructor(soundDirectory: string) {
        this.soundDirectory = soundDirectory;
    }

    // HUM__014.mp3
    async playSound(filename: string, volume=50) {
        new Promise<void>((resolve, reject) => {            
            this.stop();

            this.process = spawn('mpg321', ["-q", path.join(this.soundDirectory, filename), '-g', `${volume}`]);

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
        })

    }
    stop() {
        if (this.process !== null) {
            this.process.kill('SIGTERM');
            this.process = null;
        }
    }

    async listSounds() {
        return fs.readdir(this.soundDirectory);
    }
    
}