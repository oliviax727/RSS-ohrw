console.log("Entry javascript integrated.");

const rssApi = require('./lib/rss-api.js').default;
const displayRss = require('./lib/display-rss.js').default;
const dismissRssItem = require('./lib/dismiss-rss-item.js').default;

async function tsModuleEntry() {
    await rssApi();
    await displayRss();
    await dismissRssItem();
}

window.onload = () => { 
    mhtml.initPage(self.mrh.checkFullscreen);
    tsModuleEntry();
};

