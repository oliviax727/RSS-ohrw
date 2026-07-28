// ===== SETUP ===== //

// End-user check JS works
console.info(
	"This message should appear if the javascript integration has worked.",
);

import { ModifyFeed, ReaderState } from "./src/scripts/lib/rss.js";
import { PageData, Storer } from "./src/scripts/lib/helpers.js";
import { Navigator, Cruncher } from "./src/scripts/lib/main.js";
import BoneMiner from "./src/scripts/lib/game.js";
import { DynamicLoader } from "./src/scripts/lib/load.js";

// Constants
const SECTION_COLOR_DICT = new Map([
	["home", 300],
	["about-professional", 250],
	["about-personal", 120],
	["about-political", 0],
	["works", 45],
	["curriculum_vitae", 25],
	["links", 240],
]);

const DEFAULT_CRUNCH_SIZE = 800;

const DEFAULT_SECTION = "main";

// Main HTML functions

let data = new PageData(
	DEFAULT_CRUNCH_SIZE,
	DEFAULT_SECTION,
	SECTION_COLOR_DICT,
);

window.PageData = data;

window.Navigator = Navigator;
window.BoneMiner = BoneMiner;

// Additional RSS functions

let rssData = new ReaderState();

window.ReaderState = rssData;
window.ModifyFeed = ModifyFeed;

window.Storer = Storer;
window.DynamicLoader = DynamicLoader;

// Activate events

window.onload = () => {
	Navigator.initPage(ModifyFeed.checkFullscreen);
	ModifyFeed.getFeedFromCookies();
	BoneMiner.initMiner();
};

document.addEventListener("oncrunch", () => {
	Cruncher.onCrunch();
	Cruncher.crunchRibbon();
	Cruncher.crunchContent();
	ModifyFeed.crunchRSS();
});

document.addEventListener("onrelax", () => {
	Cruncher.onRelax();
	Cruncher.relaxRibbon();
	Cruncher.relaxContent();
	ModifyFeed.relaxRSS();
});
