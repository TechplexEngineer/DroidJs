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