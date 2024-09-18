

export type handlerOptions = {}

export interface Handler {
    // handlerName: string;
    handler(args: string[], handlerName: string): Promise<void>;
    // getOptions(): handlerOptions
}