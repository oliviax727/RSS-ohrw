"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFeedList = exports.createFeedHTML = exports.createFeed = void 0;
var _defaultModules = require("./default-modules.js");
var _fileHandlerMoules = require("./file-handler-moules.js");
var TE = _interopRequireWildcard(require("fp-ts/TaskEither"));
var M = _interopRequireWildcard(require("fp-ts/Map"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/// <reference types="node" />

// ===== TOP-LEVEL HTML RETURNS ===== //
// Produce RSS Feed as HTML object
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const createFeedHTML = (jsonFile, feedName) => (0, _defaultModules._stub)();
// Produce list of RSS feed sources as HTML object
exports.createFeedHTML = createFeedHTML;
const createFeedList = jsonFile => TE.map(feedMap => {
  return (0, _fileHandlerMoules.parseHTML)(Array.from(M.map(entryUrlList => {
    return entryUrlList.reduce((acc, val) => acc + "<li><a href='" + val.link + "'>" + val.name + "</a></li>\n", "");
  })(feedMap)).reduce((acc, [key, val]) => acc + "<h4>" + key + "</h4>\n<ul>\n" + val + "</ul>\n", ""));
})((0, _fileHandlerMoules.getFeedMap)(jsonFile));
// ===== LOAD JSON INTO XML INTO RSS ===== //
// RSS Feed
exports.createFeedList = createFeedList;
const createFeed = (jsonFile, feedName) => TE.map(sortFeed)(TE.flatMap(loadXML)(loadJSON(jsonFile, feedName)));
// Load a JSON file and then return the selected feed
exports.createFeed = createFeed;
const loadJSON = (file, selection) => TE.flatMap(feed => {
  const selectedFeed = feed.get(selection);
  return selectedFeed !== undefined ? TE.right(selectedFeed) : TE.left(new Error("Selected feed does not exist in JSON"));
})((0, _fileHandlerMoules.getFeedMap)(file));
// Generate the collection of items based on the feed
const loadXML = urlList => TE.map(entries => entries.flat())(TE.traverseArray(urlEntry => TE.map(feedData => parsedXMLToEntries(feedData, urlEntry.name))((0, _fileHandlerMoules.getXML)(urlEntry.link)))(urlList));
// Sort feed array based on date
const sortFeed = entryList => [...entryList].sort((a, b) => {
  if (a.dismissed != b.dismissed) {
    return +a.dismissed - +b.dismissed;
  } else if (a.date !== undefined && b.date !== undefined) {
    return +b.date - +a.date;
  } else {
    return b.uuid - a.uuid;
  }
});
// ===== PARSE XML DATA ===== //
// Parsed XML data to entry
const parsedXMLToEntries = (xmlData, feedName) => xmlData.items.map(item => itemToEntry(item, channelToParentData(xmlData, feedName)));
// Load parent channel data into ParentData object
const channelToParentData = (xmlData, feedName) => ({
  uuid: (0, _defaultModules.uuidURL)(xmlData.link ?? _defaultModules.HTTPS404),
  name: feedName,
  title: xmlData.title ?? "Title not found.",
  link: xmlData.link ?? _defaultModules.HTTPS404,
  imageName: xmlData.image?.title,
  imageUrl: xmlData.image?.url
});
const itemToEntry = (xmlItem, itemParent) => ({
  uuid: (0, _defaultModules.uuidURL)(xmlItem.link ?? itemParent.link),
  link: xmlItem.link ?? itemParent.link,
  title: xmlItem.title ?? itemParent.title,
  description: xmlItem.contentSnippet ?? "Description not found.",
  date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
  parentData: itemParent,
  read: false,
  dismissed: false
});