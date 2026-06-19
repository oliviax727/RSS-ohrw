/// <reference types="node" />

import { LoadRSS } from "./rss-modules";
import type { EntryFunction } from "./rss-modules";

const main: EntryFunction = async function () {
    let feed = new LoadRSS.ObjectXML.Feed(new Map([
        ["W3 Test XML", "https://raw.githubusercontent.com/oliviax727/RSS-ohrw/refs/heads/main/src/data/test_feed.xml"],
        ["ABC News", "https://www.abc.net.au/news/feed/5313390/rss.xml"]
    ])
    );

    await feed.createFeed();

    console.log(feed.entryList);
}

export default main;