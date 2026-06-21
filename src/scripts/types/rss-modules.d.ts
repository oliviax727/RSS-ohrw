import type { Either } from 'fp-ts/Either';
import type { LazyArg } from 'fp-ts/function';
interface EntryURL {
    name: string;
    link: string;
}
interface ParentData {
    uuid: number;
    name: string;
    title: string;
    link: string;
    imageUrl?: string;
    imageName?: string;
}
interface Entry {
    uuid: number;
    title: string;
    link: string;
    description: string;
    date?: Date;
    parentData: ParentData;
    read: boolean;
    dismissed: boolean;
}
export declare function createFeed(jsonFile: string, feedName: string): PromiseEither<unknown, Entry[]>;
export declare function loadXML(urlList: readonly EntryURL[]): PromiseEither<unknown, Entry[]>;
export declare const HTTPS404 = "https://oliviax727.github.io/404";
export type EntryFunction = () => Promise<void>;
export type PromiseEither<E, A> = Promise<Either<E, A>>;
export declare namespace PE {
    const propagate: <E, A>(outerEither: Either<E, Promise<A>>) => PromiseEither<E, A>;
    const tryCatch: <E, A>(f: LazyArg<Promise<A>>, onthrow: (e: unknown) => E) => PromiseEither<E, A>;
    const propagateAndFlatten: <E, A>(outerEither: Either<E, PromiseEither<E, A>>) => PromiseEither<E, A>;
    const flatten: <E, A>(outerPromise: PromiseEither<E, PromiseEither<E, A>>) => PromiseEither<E, A>;
    const map: <A, B, E>(f: (a: A) => B) => ((fa: PromiseEither<E, A>) => PromiseEither<E, B>);
    const mapAndFlatten: <A, B, E>(f: (a: A) => PromiseEither<E, B>) => ((fa: PromiseEither<E, A>) => PromiseEither<E, B>);
    const resolveAndThrow: <Err, A>(promisedEither: PromiseEither<Err, A>) => Promise<A>;
}
export declare const _throw: (error: unknown) => void;
export declare const _id: <A>(error: A) => A;
export declare const _stub: () => Either<Error, never>;
export {};
