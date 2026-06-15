/// <reference types="node" />
import Parser, {} from 'rss-parser';
export var LoadRSS;
(function (LoadRSS) {
    // Helper functions for the LoadRSS
    let RSSHelper;
    (function (RSSHelper) {
        function uuidURL(url) {
            return 0;
        }
        RSSHelper.uuidURL = uuidURL;
        // Retreive XML file
        async function getXML(url) {
            let feed = await rssParser.parseURL(url);
            console.log(feed);
            return feed;
        }
        RSSHelper.getXML = getXML;
    })(RSSHelper = LoadRSS.RSSHelper || (LoadRSS.RSSHelper = {}));
    const rssParser = new Parser();
    // RSS Feed
    class Feed {
        urlList;
        entryList = new Array();
        constructor(urlList) {
            this.urlList = urlList;
        }
        // Generate the collection of items based on the feed
        async createFeed() {
            const promisedEntries = Array.from(this.urlList).map(async ([url, name]) => {
                console.log("Getting data from: " + url);
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
        parsedXMLToEntries(xmlData, feedName) {
            const channelData = this.channelToParentData(xmlData, feedName);
            let entries = new Set(xmlData.items.map((item) => {
                return this.itemToEntry(item, channelData);
            }));
            return entries;
        }
        // Load parent channel data into ParentData object
        channelToParentData(xmlData, feedName) {
            return {
                uuid: RSSHelper.uuidURL(xmlData.feedUrl),
                name: feedName,
                title: xmlData.title,
                link: xmlData.link,
                imageName: xmlData.image?.title,
                imageUrl: xmlData.image?.url
            };
        }
        itemToEntry(xmlItem, itemParent) {
            return {
                uuid: RSSHelper.uuidURL(xmlItem.link),
                link: xmlItem.link,
                title: xmlItem.title,
                description: xmlItem.contentSnippet,
                date: xmlItem?.pubDate,
                parentData: itemParent
            };
        }
    }
    LoadRSS.Feed = Feed;
})(LoadRSS || (LoadRSS = {}));
