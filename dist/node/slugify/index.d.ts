declare const defOpt: {
    separator: string;
    lowercase: boolean;
    decamelize: boolean;
    customReplacements: any[];
    preserveLeadingUnderscore: boolean;
    preserveTrailingDash: boolean;
};
export declare type SlugifyOpt = typeof defOpt | {
    [key: string]: any;
};
export default function slugify(string: string, options?: SlugifyOpt): string;
export declare function slugifyWithCounter(): {
    (string: any, options: any): any;
    reset(): void;
};
export {};
