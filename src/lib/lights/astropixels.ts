import type { PromisifiedBus } from "i2c-bus";



export class Astropixels {
    private address: number;
    private bus: PromisifiedBus;

    constructor(connection: PromisifiedBus, address = 0x20) {
        this.address = address;
        this.bus = connection;
    }

    public SendRaw(cmd: string): string {
        const command: string[] = Array.from(cmd);
        const hexCommand: number[] = [];
        hexCommand.push(parseInt('L', 16));
        hexCommand.push(parseInt('E', 16));

        for (const i of command) {
            const h = parseInt(i.charCodeAt(0).toString(16), 16);
            hexCommand.push(h);
        }

        try {
            const bytes = hexCommand.slice(1);
            const buffer = Buffer.from(bytes);
            this.bus.writeI2cBlock(this.address, buffer[0], bytes.length, buffer);
        } catch (error) {
            console.log("Failed to send bytes");
        }
        return "Ok";
    }
}