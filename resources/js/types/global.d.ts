interface RouteHelper {
    current(name?: string): boolean;
    has(name: string): boolean;
    [key: string]: any;
}

declare global {
    function route(): RouteHelper;
    function route(name: string, params?: any, absolute?: boolean): string;
}

export {};
