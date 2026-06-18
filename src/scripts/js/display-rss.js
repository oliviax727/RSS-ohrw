/// <reference types="node" />
import { LoadRSS } from "./rss-api.js";
export default async function displayRss() {
    let feed = new LoadRSS.ObjectXML.Feed(new Map([
        ["W3 Test XML", "https://raw.githubusercontent.com/oliviax727/RSS-ohrw/refs/heads/main/src/data/test_feed.xml"],
        ["ABC News", "https://www.abc.net.au/news/feed/5313390/rss.xml"]
    ]));
    await feed.createFeed();
    console.log(feed.entryList);
}
