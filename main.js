var RSSCombiner = require('rss-combiner');
var fileSaver = require('file-saver')
import { saveAs } from fileSaver;
 
// Basic RSS feed
var feedConfig = {
  title: 'Tech news from Guardian and BBC',
  size: 20,
  feeds: [
    'http://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://www.theguardian.com/uk/technology/rss'
  ],
  pubDate: new Date()
};

function combineRSS() {
    // Promise usage
    RSSCombiner(feedConfig)
    .then(function (combinedFeed) {
        var xml = combinedFeed.xml();
    });
 
    // Node callback usage
    RSSCombiner(feedConfig, function (err, combinedFeed) {
        if (err) {
            console.error(err);
        } else {
            var xml = combinedFeed.xml();

            console.log(xml);
        }
    }); 
    }
