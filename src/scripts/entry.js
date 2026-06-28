console.log("Entry javascript integrated.");

import { loadRSS, displayNewsreaderLinks } from './app/index.js';

class Newsreader {
	// Set any feedlist div to the module-derived feed list
	static async loadNewsreaderLinks() {
		const feedList = await Newsreader.waitForFeedList();
		const newsReaderLinks = await displayNewsreaderLinks();

		console.log(feedList);
		console.log(newsReaderLinks);

		feedList.innerHTML = newsReaderLinks.innerHTML;
	}

	// Why does dealing with HTML loading have to be so complicated?
	static waitForFeedList() {
		const existingFeedList = document.querySelector(".feedlist");

		if (existingFeedList !== null) {
			return Promise.resolve(existingFeedList);
		}

		// Check for mutations and return the feed when it happens
		return new Promise((resolve) => {
			
			const observer = new MutationObserver(() => {
				const feedList = document.querySelector(".feedlist");

				if (feedList !== null) {
					observer.disconnect();
					resolve(feedList);
				}
			});

			observer.observe(document.documentElement, {
				childList: true,
				subtree: true,
			});
		});
	}

	// Initialise all newsreader functions
	static async initializeNewsreader() {
		try {
			await Newsreader.loadNewsreaderLinks();
			await loadRSS();
		} catch (error) {
			console.log("The following error was encountered: " + error);
			console.log(error.stack);
		} finally {
			console.log("Node Modules successfully loaded and executed.")
		}
	}

	// Wait for the page to load
	static waitForLoad(callback) {
		if (document.readyState === "complete") {
			void callback();
			return;
		}

		window.addEventListener("load", () => {
			void callback();
		}, { once: true });
	}
}

Newsreader.waitForLoad(Newsreader.initializeNewsreader);
