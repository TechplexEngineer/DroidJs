import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        hardware: [
            {
                type: "i2c: PCA9685: 16 Channel PWM Generator",
                name: "Body",
                config: {
                    i2cAddress: 0x40,
                    frequency: 50
                }
            },
            {
                type: "i2c: PCA9685: 16 Channel PWM Generator",
                name: "Dome Servos",
                config: {
                    i2cAddress: 0x40,
                    frequency: 50
                }
            },
            {
                type: "Serial: Astropixels",
                name: "Dome Lights",
                config: {
                    bus: "/dev/ttyUSB0",
                    baud: 9600
                }
            }
        ]
    };
}) satisfies PageServerLoad;