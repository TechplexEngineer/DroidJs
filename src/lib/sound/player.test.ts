import { describe, it, expect } from 'vitest';
import { groupSounds } from './groupSounds';


describe('groupSounds', () => {``
    it('should group sounds by top-level directory', async () => {
        const sounds = [
            'SENT/SENT_001.mp3',
            'SENT/SENT_002.mp3',
            'SOUND/SOUND_001.mp3',
            'SOUND/SENT/SENT_003.mp3'
        ];

        const result = await groupSounds(sounds);

        expect(result).toEqual({
            'SENT': ['SENT_001.mp3', 'SENT_002.mp3'],
            'SOUND': ['SOUND_001.mp3', 'SENT/SENT_003.mp3']
        });
    });

    it('should handle sounds in the root directory', async () => {
        const sounds = [
            'SENT_001.mp3',
            'SENT/SENT_002.mp3',
            'SOUND_001.mp3'
        ];

        const result = await groupSounds(sounds);

        expect(result).toEqual({
            '': ['SENT_001.mp3', 'SOUND_001.mp3'],
            'SENT': ['SENT_002.mp3']
        });
    });

    it('should return an empty object for an empty input', async () => {
        const sounds: string[] = [];

        const result = await groupSounds(sounds);

        expect(result).toEqual({});
    });

    it('should handle nested directories correctly', async () => {
        const sounds = [
            'SOUND/SENT/SENT_001.mp3',
            'SOUND/SENT/SENT_002.mp3',
            'SOUND/OTHER/OTHER_001.mp3'
        ];

        const result = await groupSounds(sounds);

        expect(result).toEqual({
            'SOUND': ['SENT/SENT_001.mp3', 'SENT/SENT_002.mp3', 'OTHER/OTHER_001.mp3']
        });
    });
});
