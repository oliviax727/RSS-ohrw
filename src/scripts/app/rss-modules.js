"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._throw = exports._stub = exports._id = exports.PE = exports.HTTPS404 = void 0;
exports.createFeed = createFeed;
exports.loadXML = loadXML;
var _rssParser = _interopRequireDefault(require("rss-parser"));
var Eth = _interopRequireWildcard(require("fp-ts/Either"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/// <reference types="node" />

// RSS Feed
async function createFeed(jsonFile, feedName) {
  return PE.map(sortFeed)(PE.mapAndFlatten(loadXML)(loadJSON(jsonFile, feedName)));
}
/* eslint-disable */
async function loadJSON(file, selection) {
  await getXML("");
  return _stub();
}
/* eslint-enable */
// Generate the collection of items based on the feed
async function loadXML(urlList) {
  return urlList.map(async urlEntry => {
    return PE.map(feedData => parsedXMLToEntries(feedData, urlEntry.name))(getXML(urlEntry.link));
  }).reduce((accPE, arrPE) => Promise.all([accPE, arrPE]).then(([acc, arr]) => Eth.isLeft(arr) ? acc : Eth.right([...(Eth.isLeft(acc) ? [] : acc.right), ...arr.right])), Promise.resolve(Eth.right([])));
}
// Sort feed array based on date
function sortFeed(entryList) {
  return [...entryList].sort((a, b) => {
    if (a.dismissed != b.dismissed) {
      return +a.dismissed - +b.dismissed;
    } else if (a.date !== undefined && b.date !== undefined) {
      return +b.date - +a.date;
    } else {
      return b.uuid - a.uuid;
    }
  });
}
// Parsed XML data to entry
function parsedXMLToEntries(xmlData, feedName) {
  return xmlData.items.map(item => itemToEntry(item, channelToParentData(xmlData, feedName)));
}
// Load parent channel data into ParentData object
function channelToParentData(xmlData, feedName) {
  return {
    uuid: uuidURL(xmlData.link ?? HTTPS404),
    name: feedName,
    title: xmlData.title ?? "Title not found.",
    link: xmlData.link ?? HTTPS404,
    imageName: xmlData.image?.title,
    imageUrl: xmlData.image?.url
  };
}
function itemToEntry(xmlItem, itemParent) {
  return {
    uuid: uuidURL(xmlItem.link ?? itemParent.link),
    link: xmlItem.link ?? itemParent.link,
    title: xmlItem.title ?? itemParent.title,
    description: xmlItem.contentSnippet ?? "Description not found.",
    date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
    parentData: itemParent,
    read: false,
    dismissed: false
  };
}
// ===== FILE AND FETCH HANDLING ===== //
const rssParser = new _rssParser.default();
function uuidURL(url, seed = 5381) {
  return Array.from(url).reduce(
  // hash * 33 + charCode (bitwise shift for efficiency: hash << 5 is hash * 32)
  (seed, char) => (seed << 5) + seed + char.charCodeAt(0), seed) >>> 0;
}
// Retreive XML file
async function getXML(url) {
  return PE.mapAndFlatten(textXML => PE.tryCatch(() => rssParser.parseString(textXML), _id))(PE.tryCatch(() => fetch(url).then(responseXML => {
    if (responseXML.ok) {
      return responseXML.text();
    } else {
      throw new Error("A error occured HTTP. Code: " + responseXML.status.toString());
    }
  }), _id));
}
// ===== TYPE EXPORTS ===== //
const HTTPS404 = exports.HTTPS404 = "https://oliviax727.github.io/404";
// eslint-disable-next-line @typescript-eslint/no-namespace
var PE;
(function (PE) {
  PE.propagate = outerEither => Eth.isLeft(outerEither) ? Promise.resolve(Eth.left(outerEither.left)) : outerEither.right.then(value => Eth.right(value));
  PE.tryCatch = (f, onthrow) => PE.propagate(Eth.tryCatch(f, onthrow));
  PE.propagateAndFlatten = outerEither => PE.propagate(outerEither).then(Eth.flatten);
  PE.flatten = outerPromise => outerPromise.then(PE.propagateAndFlatten);
  PE.map = f => fa => fa.then(Eth.map(f));
  PE.mapAndFlatten = f => fa => fa.then(Eth.map(f)).then(PE.propagateAndFlatten);
  PE.resolveAndThrow = promisedEither => promisedEither.then(either => {
    if (Eth.isLeft(either)) {
      throw Eth.toError(either.left);
    }
    return either.right;
  });
})(PE || (exports.PE = PE = {}));
// eslint-disable-next-line functional/no-return-void, functional/no-throw-statements
const _throw = error => {
  throw error;
};
exports._throw = _throw;
const _id = error => error;
// eslint-disable-next-line functional/functional-parameters
exports._id = _id;
const _stub = () => Eth.left(new Error("Unknown Error"));
exports._stub = _stub;