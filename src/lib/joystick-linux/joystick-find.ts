import os from 'os';

const isLinux = os.platform() === 'linux';
console.log("isLinux", isLinux)
const js = isLinux ? await import("./joystick-find-ioctl") : await import("./joystick-find-mock")
// const js = await import("./joystick-find-ioctl");
// const js = await import("./joystick-find-mock");

export const listJoysticks = async (): Promise<{
    number: number;
    path: string;
    name: string;
    numButtons: number;
    numAxes: number;
    buttonMap: Record<number, string>;
    axisMap: Record<number, string>;
}[]> => {
    return js.listJoysticks();
};

