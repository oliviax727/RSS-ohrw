"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rssModules = require("./rss-modules");
/// <reference types="node" />

const main = async function () {
  const feed = await (0, _rssModules.decideUnsafe)((0, _rssModules.loadXML)([{
    name: "W3 Test XML",
    link: "https://raw.githubusercontent.com/oliviax727/RSS-ohrw/refs/heads/main/src/data/test_feed.xml"
  }, {
    name: "ABC News",
    link: "https://www.abc.net.au/news/feed/5313390/rss.xml"
  }]));
  console.log(feed);
};
var _default = exports.default = main;