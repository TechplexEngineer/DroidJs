declare module 'ioctl' {
    /**
     * Perform an ioctl system call.
     * @param fd - The file descriptor.
     * @param request - The request code.
     * @param argp - An optional argument, which can be an integer or a Buffer.
     * @returns The result of the ioctl call.
     * @throws Will throw an error if the arguments are not of the expected types or if the ioctl call fails.
     */
    export default function ioctl(fd: number, request: number, argp?: number | Buffer): number;
}