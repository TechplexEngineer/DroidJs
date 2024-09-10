import fs from 'fs/promises';

export class fileDb {
    private filePath: string
    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async read() {
        await fs.access(this.filePath).catch(async () =>
            await fs.writeFile(this.filePath, '{}'))

        return JSON.parse(await fs.readFile(this.filePath, 'utf-8'));
    }

    async update(updateFn: (data: Record<string, any>) => Record<string, any>) {
        const data = this.read();
        const updatedData = updateFn(data);
        await fs.writeFile(this.filePath, JSON.stringify(updatedData, null, 2));
    }
}

