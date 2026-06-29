import type { TaskEither } from "fp-ts/TaskEither";
interface ParentData {
    uuid: number;
    name: string;
    title: string;
    link: string;
    imageUrl?: string;
    imageName?: string;
}
export interface Entry {
    uuid: number;
    title: string;
    link: string;
    description: string;
    date?: Date;
    parentData: ParentData;
    read: boolean;
    dismissed: boolean;
}
export declare const createFeedHTML: (jsonFile: string, feedName: string) => TaskEither<unknown, HTMLElement>;
export declare const createFeedList: (jsonFile: string) => TaskEither<unknown, HTMLElement>;
export declare const createFeed: (jsonFile: string, feedName: string) => TaskEither<unknown, Entry[]>;
export {};
