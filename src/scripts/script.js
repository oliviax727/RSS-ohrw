console.log("Testing import ...");
try {
  await import('https://esm.sh/test-import');
} catch (error) {
  console.log("Entry imports don't work: " + error);
} finally {
  console.log("Entry javascript integrated. Imports work!");
}
import rssApi from './app/rss-api.js';
import displayRss from './app/display-rss.js';
import dismissRssItem from './app/dismiss-rss-item.js';
export default async function tsModuleEntry() {
  console.log("hello");

  //await rssApi();
  //await displayRss();
  //await dismissRssItem();
}
