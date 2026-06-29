import Parser from "rss-parser";
import type { TaskEither } from "fp-ts/TaskEither";
export interface EntryURL {
    name: string;
    link: string;
}
interface JSONModule {
    default?: unknown;
}
export type FeedMap = Map<string, EntryURL[]>;
export type rssData = Parser.Output<object>;
export type rssItem = Parser.Item;
export declare const parseHTML: (html: string) => HTMLElement;
export declare const getFeedMap: (fileName: string) => TaskEither<unknown, FeedMap>;
export declare const getJSON: (file: string) => TaskEither<unknown, JSONModule>;
export declare const getXML: (file: string) => TaskEither<unknown, Parser.Output<object>>;
export {};
