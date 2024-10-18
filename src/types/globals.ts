// /**
//  * make all properties as optional recursively
//  */
// export type DeepPartial<T> = T extends object
//   ? {
//       [P in keyof T]?: DeepPartial<T[P]>;
//     }
//   : T;

/**
 * null | type
 */
export type Nullable<T> = T | null | undefined;

/**
 * Partializing properties
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
/**
 * Partializing properties deeper
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? DeepPartial<T[P]>
    : T[P];
};

// declare require types
export declare function require<T>(name: string): T;
