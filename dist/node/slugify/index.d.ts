declare const defOpt: {
    separator: string;
    lowercase: boolean;
    decamelize: boolean;
    customReplacements: string[];
    preserveLeadingUnderscore: boolean;
    preserveTrailingDash: boolean;
};
export type SlugifyOpt = typeof defOpt | {
    [key: string]: any;
};
export default function slugify(string: string, options?: SlugifyOpt): string;
export declare function slugifyWithCounter(): {
    (str: string, options: SlugifyOpt): string;
    reset(): void;
};
export {};
