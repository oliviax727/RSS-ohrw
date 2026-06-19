"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rssModules = require("./rss-modules");
/// <reference types="node" />

const main = async function () {
  let feed = new _rssModules.LoadRSS.ObjectXML.Feed(new Map([["W3 Test XML", "https://raw.githubusercontent.com/oliviax727/RSS-ohrw/refs/heads/main/src/data/test_feed.xml"], ["ABC News", "https://www.abc.net.au/news/feed/5313390/rss.xml"]]));
  await feed.createFeed();
  console.log(feed.entryList);
};
var _default = exports.default = main;