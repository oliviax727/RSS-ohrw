/// <reference types="node" />

import Parser, { type Output } from 'rss-parser';

export namespace LoadRSS {

    // Load RSS object into HTML
    export namespace ObjectHTML {

    }

    // Load RSS object from XML
    export namespace ObjectXML {

        
    }

    // Helper functions for the LoadRSS
    export namespace RSSHelper {
        export function uuidURL(url: string): number {
            return 0;
        }

        // Retreive XML file
        export async function getXML(url: string):  Promise<Parser.Output<{}>> {
            let feed = await rssParser.parseURL(url);
            return feed;
        }
    }

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

        date?: string;

        parentData: ParentData;
    }

    const rssParser: Parser<{}, {}> = new Parser();

    // RSS Feed
    export class Feed {

        urlList: Map<string, string>;
        entryList: Array<Entry> = new Array();

        constructor(urlList: Map<string, string>) {
            this.urlList = urlList;
        }

        // Generate the collection of items based on the feed
        async createFeed(): Promise<void> {
            const promisedEntries = Array.from(this.urlList).map(async ([url, name]: string[]) => {
                console.log("Getting data from: "+url);
                let feedData = await RSSHelper.getXML(url);
                const entriesToAdd = this.parsedXMLToEntries(feedData, name);
                return entriesToAdd;
            });
            //const unconcatenatedEntries = await Promise.all(promisedEntries);



            /*unconcatenatedEntries.forEach((entrySet: Set<Entry>) => {
                this.entryList = [...this.entryList, ...entrySet];
            })*/

            //console.log(unconcatenatedEntries);
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
                uuid: RSSHelper.uuidURL(xmlData.feedUrl as string),
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
                date: xmlItem?.pubDate,
                parentData: itemParent
            };
        }
    }

    

}
