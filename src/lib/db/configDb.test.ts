import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigDb } from './configDb';
import { FileDb } from './jsondb';
import fs from 'fs/promises';

describe('ConfigDb', () => {
    const filePath = './db.test.json';
    let db: FileDb;
    let configDb: ConfigDb;

    beforeEach(async () => {
        db = new FileDb(filePath);
        configDb = new ConfigDb(db);
    });

    afterEach(async () => {
        await fs.rm(filePath);
    });

    it('should update an existing servo by name', async () => {
        const initialData = {
            servos: [
                { name: 'servo1', hardware: 'hw1', channel: 1, min: 0, max: 180, home: 90 }
            ]
        };
        await fs.writeFile(filePath, JSON.stringify(initialData));

        const updatedData = { min: 10, max: 170 };
        await configDb.updateServoByName('servo1', updatedData);

        const data = await db.read();
        expect(data.servos[0]).toEqual({ ...initialData.servos[0], ...updatedData });
    });

    it('should throw an error when updating a non-existing servo', async () => {
        const initialData = {
            servos: [
                { name: 'servo1', hardware: 'hw1', channel: 1, min: 0, max: 180, home: 90 }
            ]
        };
        await fs.writeFile(filePath, JSON.stringify(initialData));

        await expect(configDb.updateServoByName('nonExistingServo', { min: 10 }))
            .rejects
            .toThrow('Servo not found: nonExistingServo');
    });

    it('should leave other sections of the config alone when updating a servo', async () => {
        const initialData = {
            servos: [
                { name: 'servo1', hardware: 'hw1', channel: 1, min: 0, max: 180, home: 90 }
            ],
            controllerMap: {
                'drive fwd': { joystickName: 'joy1', buttonOrAxisName: 'btn1' }
            }
        };
        await fs.writeFile(filePath, JSON.stringify(initialData));

        await configDb.updateServoByName('servo1', { min: 10 });

        const data = await db.read();
        expect(data.controllerMap).toEqual(initialData.controllerMap);
        expect(data.servos[0]).toEqual({ ...initialData.servos[0], min: 10 });
    });
});