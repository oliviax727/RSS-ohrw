/// <reference types="node" />

import { loadXML, decideUnsafe } from "./rss-modules";
import type { EntryFunction } from "./rss-modules";

const main: EntryFunction = async function () {
	const feed = await decideUnsafe(
		loadXML([
			{
				name: "W3 Test XML",
				link: "https://raw.githubusercontent.com/oliviax727/RSS-ohrw/refs/heads/main/src/data/test_feed.xml",
			},
			{
				name: "ABC News",
				link: "https://www.abc.net.au/news/feed/5313390/rss.xml",
			},
		]),
	);

	console.log(feed);
};

export default main;
