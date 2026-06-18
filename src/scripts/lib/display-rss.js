"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = displayRss;
var _rssApi = require("./rss-api.js");
/// <reference types="node" />

async function displayRss() {
  let feed = new _rssApi.LoadRSS.ObjectXML.Feed(new Map([["W3 Test XML", "https://raw.githubusercontent.com/oliviax727/RSS-ohrw/refs/heads/main/src/data/test_feed.xml"], ["ABC News", "https://www.abc.net.au/news/feed/5313390/rss.xml"]]));
  await feed.createFeed();
  console.log(feed.entryList);
}