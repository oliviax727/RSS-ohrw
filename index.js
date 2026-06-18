// ===== SETUP ===== //

// End-user check JS works
console.info("This message should appear if the javascript integration has worked.");

import Helpers from './src/scripts/js/helpers.js';
import MainHTML from './src/scripts/js/main.js';
import BoneMiner from './src/scripts/js/game.js';
import ReaderState, { ModifyRSSHTML } from './src/scripts/js/rss.js';

// Constants
const SECTION_COLOR_DICT = new Map([
    ["primary", 300],
    ["local", 45],
    ["global", 25],

    ["politics-local", 120],
    ["politics-australia", 180],
    ["politics-global", 0],

    ["satire", 195],

    ["publications-astronomy", 250],
    ["publications-other", 240],

    ["tech", 270]
]);

const DEFAULT_CRUNCH_SIZE = 1120;

const DEFAULT_SECTION = 'primary';

// Main HTML functions

let mhtml = new MainHTML(SECTION_COLOR_DICT, DEFAULT_CRUNCH_SIZE, DEFAULT_SECTION);

window.help = Helpers;
window.bm = BoneMiner;

window.onresize = mhtml.crunch;

// Additional RSS functions

let rssData = new ReaderState();

window.mrh = ModifyRSSHTML;

window.onload = () => { 
    mhtml.initPage(self.mrh.checkFullscreen);
};
