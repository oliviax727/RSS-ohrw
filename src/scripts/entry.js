console.log("Entry javascript integrated.");

import { loadRSS, displayNewsreaderLinks } from './app/index.js';
import { DynamicLoader } from './lib/load.cjs';

class Newsreader {
	// Initialise all newsreader functions
	static async initializeNewsreader() {
		try {
			const newsReaderLinks = await displayNewsreaderLinks();
			await DynamicLoader.dynamicLoad(".feedlist", newsReaderLinks.innerHTML);
			await loadRSS();
		} catch (error) {
			console.log("The following error was encountered: " + error);
			console.log(error.stack);
		} finally {
			console.log("Node Modules successfully loaded and executed.")
		}
	}
}

DynamicLoader.waitForLoad(Newsreader.initializeNewsreader);
