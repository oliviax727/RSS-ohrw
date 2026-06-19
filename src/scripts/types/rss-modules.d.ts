import Parser from 'rss-parser';
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
export declare class Feed {
    urlList: Map<string, string>;
    entryList: Entry[];
    constructor(urlList: Map<string, string>);
    createFeed(): Promise<void>;
    sortFeed(): void;
    parsedXMLToEntries(xmlData: Parser.Output<object>, feedName: string): Set<Entry>;
    channelToParentData(xmlData: Parser.Output<object>, feedName: string): ParentData;
    itemToEntry(xmlItem: Parser.Item, itemParent: ParentData): Entry;
}
export type EntryFunction = () => Promise<void>;
export {};
