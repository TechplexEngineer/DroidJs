import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileDb } from './jsondb';
import fs from 'fs/promises';


describe('fileDb', () => {
    const filePath = './db.test.json';

    afterEach(async () => {
        await fs.rm(filePath);
    });

    it('should create the file if it does not exist', async () => {
        const db = new FileDb(filePath);
        const data = await db.read();
        expect(data).toEqual({});
    });

    it('should read data from the file', async () => {
        const initialData = { key: 'value' };
        await fs.writeFile(filePath, JSON.stringify(initialData));
        console.log(JSON.parse(await fs.readFile(filePath, 'utf-8')));

        const db = new FileDb(filePath);

        const data = await db.read();
        expect(data).toEqual(initialData);
    });

    it('should update data in the file', async () => {
        const initialData = { key: 'value' };
        await fs.writeFile(filePath, JSON.stringify(initialData));

        const db = new FileDb(filePath);
        const updatedData = { key: 'newValue' };


        await db.update((data) => {
            data.key = 'newValue';
            return data;
        });

        const data = await db.read();
        expect(data).toEqual(updatedData);
    });

});