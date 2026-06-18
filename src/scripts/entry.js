console.log("Entry javascript integrated.");

const rssApi = require('./app/rss-api.js').default;
const displayRss = require('./app/display-rss.js').default;
const dismissRssItem = require('./app/dismiss-rss-item.js').default;

function tsModuleEntry() {
    await rssApi();
    await displayRss();
    await dismissRssItem();
}

tsModuleEntry();

/*export default async function tsModuleEntry() {
    await rssApi();
    await displayRss();
    await dismissRssItem();
}*/

