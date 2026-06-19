/// <reference types="node" />

import Parser, { type Output } from 'rss-parser';

export default function rssApi() {
    console.log("rss-api module loaded");
}

export namespace LoadRSS {

    // Load RSS object into HTML
    export namespace ObjectHTML {

    }

    // Load RSS object from XML
    export namespace ObjectXML {

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

        // RSS Feed
        export class Feed {

            urlList: Map<string, string>;
            entryList: Array<Entry> = new Array();

            constructor(urlList: Map<string, string>) {
                this.urlList = urlList;
            }

            // Generate the collection of items based on the feed
            async createFeed(): Promise<void> {

                const promisedEntries = Array.from(this.urlList).map(async ([name, url]: string[]) => {
                    console.log("Getting data from: " + url);
                    const feedData = await RSSHelper.getXML(url);

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
            parsedXMLToEntries(xmlData: Parser.Output<{}>, feedName: string): Set<Entry> {
                const channelData: ParentData = this.channelToParentData(xmlData, feedName);

                let entries = new Set(xmlData.items.map((item: Parser.Item) => {
                    return this.itemToEntry(item, channelData);
                }));

                return entries;
            }

            // Load parent channel data into ParentData object
            channelToParentData(xmlData: Parser.Output<{}>, feedName: string): ParentData {
                return {
                    uuid: RSSHelper.uuidURL(xmlData.link as string),
                    name: feedName,
                    title: xmlData.title as string,
                    link: xmlData.link as string,
                    imageName: xmlData.image?.title,
                    imageUrl: xmlData.image?.url
                };
            }

            itemToEntry(xmlItem: Parser.Item, itemParent: ParentData): Entry {
                return {
                    uuid: RSSHelper.uuidURL(xmlItem.link as string),
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

    }

    // Helper functions for the LoadRSS
    export namespace RSSHelper {

        const rssParser: Parser<{}, {}> = new Parser();

        export function uuidURL(url: string): number {
            function getHash(str: string, seed: number = 5381) {
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
        export async function getXML(url: string): Promise<Parser.Output<{}> | undefined> {
            let responseXML = undefined;
            
            try {
                responseXML = await fetch(url);
            } catch (error: unknown) {
                console.log("An unknown error occured while fetching the XML file: "+url+";\n" +error);
            } finally {
                if (responseXML?.ok) {
                    const textXML = await responseXML.text();
                    return await rssParser.parseString(textXML);
                } else {
                    console.log("A error occured HTTP. Code: " + responseXML?.status);
                }
            }

            return undefined;
        }
    }

}
