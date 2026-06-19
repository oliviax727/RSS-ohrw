/// <reference types="node" />

import Parser from 'rss-parser';

// ===== LOAD RSS INTO HTML ===== //


// ===== LOAD XML INTO RSS ===== //

// RSS parent data
interface ParentData {
    uuid: number;
    name: string;

    title: string;
    link: string;

    imageUrl?: string;
    imageName?: string;
}

// RSS entry object
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

// RSS Feed
export class Feed {

    urlList: Map<string, string>;
    entryList = new Array<Entry>();

    constructor(urlList: Map<string, string>) {
        this.urlList = urlList;
    }

    // Generate the collection of items based on the feed
    async createFeed(): Promise<void> {

        const promisedEntries = Array.from(this.urlList).map(async ([name, url]: string[]) => {
            console.log("Getting data from: " + url);
            const feedData = await getXML(url);

            if (feedData == undefined) {
                return undefined;
            }

            const entriesToAdd = this.parsedXMLToEntries(feedData, name);
            return entriesToAdd;
        });

        const unconcatenatedEntries = await Promise.all(promisedEntries);

        unconcatenatedEntries.forEach((entrySet: Set<Entry> | undefined) => {
            if (entrySet != undefined) {
                this.entryList = [...this.entryList, ...entrySet];
            }
        })

        this.sortFeed();
    }

    // Sort feed array based on date
    sortFeed(): void {
        this.entryList.sort((a: Entry, b: Entry) => {
            if (a.dismissed != b.dismissed) {
                return (+a.dismissed) - (+b.dismissed)
            } else if (a.date !== undefined && b.date !== undefined) {
                return (+b.date) - (+a.date);
            } else {
                return b.uuid - a.uuid;
            }
        })
    }

    // Parsed XML data to entry
    parsedXMLToEntries(xmlData: Parser.Output<object>, feedName: string): Set<Entry> {
        const channelData: ParentData = this.channelToParentData(xmlData, feedName);

        const entries = new Set(xmlData.items.map((item: Parser.Item) => {
            return this.itemToEntry(item, channelData);
        }));

        return entries;
    }

    // Load parent channel data into ParentData object
    channelToParentData(xmlData: Parser.Output<object>, feedName: string): ParentData {
        return {
            uuid: uuidURL(xmlData.link as string),
            name: feedName,
            title: xmlData.title as string,
            link: xmlData.link as string,
            imageName: xmlData.image?.title,
            imageUrl: xmlData.image?.url
        };
    }

    itemToEntry(xmlItem: Parser.Item, itemParent: ParentData): Entry {
        return {
            uuid: uuidURL(xmlItem.link as string),
            link: xmlItem.link as string,
            title: xmlItem.title as string,
            description: xmlItem.contentSnippet as string,
            date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
            parentData: itemParent,
            read: false,
            dismissed: false
        };
    }
}

// ===== FILE AND FETCH HANDLING ===== //


const rssParser = new Parser<object, object>();

function uuidURL(url: string): number {
    function getHash(str: string, seed = 5381) {
        for (let i = 0; i < str.length; i++) {
            // hash * 33 + charCode (bitwise shift for efficiency: hash << 5 is hash * 32)
            seed = (seed << 5) + seed + str.charCodeAt(i);
        }
        // Convert to unsigned 32-bit integer to avoid negative values
        return seed >>> 0;
    }

    return getHash(url);
}

// Retreive XML file
async function getXML(url: string): Promise<Parser.Output<object> | undefined> {
    try {
        const responseXML = await fetch(url);

        if (responseXML?.ok) {
            const textXML = await responseXML.text();
            return await rssParser.parseString(textXML);
        } else {
            console.log("A error occured HTTP. Code: " + responseXML?.status);
        }

    } catch (error: unknown) {
        console.log("An unknown error occured while fetching the XML file: " + url + ";\n" + error);
    }

    return undefined;
}

// ===== TYPE EXPORTS ===== //

export type EntryFunction = () => Promise<void>;

export namespace e {
    
}