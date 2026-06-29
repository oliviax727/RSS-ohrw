console.log("Entry javascript integrated.");

import { loadRSS, displayNewsreaderLinks } from './app/index.js';
import { Storer } from './lib/helpers.cjs';
import { DynamicLoader } from './lib/load.cjs';

class Newsreader {
	// Initialise all newsreader functions
	static async initializeNewsreader() {
		try {
			const newsReaderLinks = await displayNewsreaderLinks();
			await DynamicLoader.dynamicLoad(".feedlist", newsReaderLinks.innerHTML);

			const setRSSFeed = async (feedName) => (await loadRSS([self.ReaderState.entryDataMap, feedName])).innerHTML;
			await DynamicLoader.dynamicLoad("[data-xml-id]", setRSSFeed, "data-xml-id");

			self.Navigator.loadPage(null, () => {
						ModifyFeed.checkFullscreen(fullscreen);
					});
		} catch (error) {
			console.log("The following error was encountered: " + error);
			console.log(error.stack);
		} finally {
			console.log("Node Modules successfully loaded and executed.")
		}
	}
}

DynamicLoader.waitForLoad(Newsreader.initializeNewsreader);

window.Newsreader = Newsreader
