// A class for loading objects into the webpage
export class DynamicLoader {

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

	// Wait for one or more elements matching the selector to exist.
	static waitForSelectorLoad(selector) {
		const existingFeedLists = document.querySelectorAll(selector);

		if (existingFeedLists.length > 0) {
			return Promise.resolve(Array.from(existingFeedLists));
		}

		// Check for mutations and return the feed when it happens
		return new Promise((resolve) => {
			const observer = new MutationObserver(() => {
				const feedLists = document.querySelectorAll(selector);

				if (feedLists.length > 0) {
					observer.disconnect();
					resolve(Array.from(feedLists));
				}
			});

			observer.observe(document.documentElement, {
				childList: true,
				subtree: true,
			});
		});
	}

	// Set any feedlist div to the module-derived feed list
	static async dynamicLoad(selector, data) {
		const selectedElements = await DynamicLoader.waitForSelectorLoad(selector);

		for (let i = 0; i < selectedElements.length; i++) {
			selectedElements[i].innerHTML = data;
		}
	}
}