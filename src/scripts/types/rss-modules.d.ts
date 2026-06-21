import type { TaskEither } from 'fp-ts/TaskEither';
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
export declare function createFeed(jsonFile: string, feedName: string): TaskEither<unknown, Entry[]>;
export declare function loadXML(urlList: readonly EntryURL[]): TaskEither<unknown, Entry[]>;
export declare const HTTPS404 = "https://oliviax727.github.io/404";
export type EntryFunction = () => Promise<void> | void;
export declare const _throw: (error: unknown) => void;
export declare const _id: <A>(error: A) => A;
export declare const _stub: () => TaskEither<Error, never>;
export declare const decideUnsafe: <Err, A>(taskEither: TaskEither<Err, A>) => Promise<A>;
export {};
