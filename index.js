// ===== SETUP ===== //

// End-user check JS works
console.info("This message should appear if the javascript integration has worked.");

import Helpers from './src/scripts/helpers.js';
import MainHTML from './src/scripts/main.js';
import BoneMiner from './src/scripts/miner.js';

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

const CRUNCH_SIZE = 1120;

const DEFAULT_SECTION = 'primary';

let mhtml = new MainHTML(SECTION_COLOR_DICT, CRUNCH_SIZE, DEFAULT_SECTION);

window.bm = BoneMiner;
window.help = Helpers;

window.onload = mhtml.initPage;
window.onresize = mhtml.crunch;