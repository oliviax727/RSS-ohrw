console.log("Entry javascript integrated.");

import { loadRSS, displayNewsreaderLinks } from './app/index.js';

class Newsreader {
	// Initialise all newsreader functions
	static async initializeNewsreader() {
		try {
			const newsReaderLinks = await displayNewsreaderLinks();
			await self.DynamicLoader.dynamicLoad(".feedlist", newsReaderLinks.innerHTML);

			const setRSSFeed = async (feedName) => (await loadRSS([self.ReaderState.entryDataMap, feedName])).innerHTML;

			Newsreader.setFeedIDs();

			await self.DynamicLoader.dynamicLoad("[data-xml-id]", setRSSFeed, "data-xml-id");
		} catch (error) {
			console.log("The following error was encountered: " + error);
			console.log(error.stack);
		} finally {
			console.log("Node Modules successfully loaded and executed.")
		}
	}

	// Alter every instance of set-xml-id
	static setFeedIDs() {
		var feeds = document.querySelectorAll("[set-xml-id]");

		for (let i = 0; i < feeds.length; i++) {
			feeds[i].setAttribute("data-xml-id", self.PageData.CURRENT_SECTION);
		}
	}
}

self.DynamicLoader.waitForLoad(self.ModifyFeed.reloadFeed);

window.Newsreader = Newsreader
