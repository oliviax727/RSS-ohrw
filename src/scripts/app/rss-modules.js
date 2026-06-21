"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._throw = exports._stub = exports._id = exports.PE = void 0;
exports.createFeed = createFeed;
exports.loadXML = loadXML;
var _rssParser = _interopRequireDefault(require("rss-parser"));
var Eth = _interopRequireWildcard(require("fp-ts/Either"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /// <reference types="node" />
// RSS Feed
async function createFeed(jsonFile, feedName) {
  return PE.map(sortFeed)(PE.mapAndFlatten(loadXML)(loadJSON(jsonFile, feedName)));
}
async function loadJSON(file, selection) {
  await getXML("");
  return _stub();
}
// Generate the collection of items based on the feed
async function loadXML(urlList) {
  const promisedEntries = urlList.map(async urlEntry => {
    console.log("Getting data for: " + urlEntry.name);
    return PE.map(feedData => parsedXMLToEntries(feedData, urlEntry.name))(getXML(urlEntry.link));
  });
  return promisedEntries.reduce((accPE, arrPE) => Promise.all([accPE, arrPE]).then(([acc, arr]) => Eth.isLeft(arr) ? acc : Eth.right([...(Eth.isLeft(acc) ? [] : acc.right), ...arr.right])), Promise.resolve(Eth.right([])));
}
// Sort feed array based on date
function sortFeed(entryList) {
  return entryList.sort((a, b) => {
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
    uuid: uuidURL(xmlData.link),
    name: feedName,
    title: xmlData.title,
    link: xmlData.link,
    imageName: xmlData.image?.title,
    imageUrl: xmlData.image?.url
  };
}
function itemToEntry(xmlItem, itemParent) {
  return {
    uuid: uuidURL(xmlItem.link),
    link: xmlItem.link,
    title: xmlItem.title,
    description: xmlItem.contentSnippet,
    date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
    parentData: itemParent,
    read: false,
    dismissed: false
  };
}
// ===== FILE AND FETCH HANDLING ===== //
const rssParser = new _rssParser.default();
function uuidURL(url) {
  function getHash(str, seed = 5381) {
    for (let i = 0; i < str.length; i++) {
      // hash * 33 + charCode (bitwise shift for efficiency: hash << 5 is hash * 32)
      seed = (seed << 5) + seed + str.charCodeAt(i);
    }
    // Convert to unsigned 32-bit integer to avoid negative values
    return seed >>> 0;
  }
  return getHash(url);
}
// Retreive XML file
async function getXML(url) {
  return PE.mapAndFlatten(textXML => PE.tryCatch(() => rssParser.parseString(textXML), _id))(PE.tryCatch(() => fetch(url).then(responseXML => {
    if (responseXML?.ok) {
      return responseXML.text();
    } else {
      throw new Error("A error occured HTTP. Code: " + responseXML.status.toString());
    }
  }), _id));
}
var PE;
(function (PE) {
  PE.fromPromise = outerEither => Eth.isLeft(outerEither) ? Promise.resolve(Eth.left(outerEither.left)) : outerEither.right.then(value => Eth.right(value));
  PE.propagate = outerEither => PE.fromPromise(outerEither);
  PE.tryCatch = (f, onthrow) => PE.fromPromise(Eth.tryCatch(f, onthrow));
  PE.propagateAndFlatten = outerEither => PE.propagate(outerEither).then(Eth.flatten);
  PE.flatten = outerPromise => outerPromise.then(PE.propagateAndFlatten);
  PE.map = f => fa => fa.then(Eth.map(f));
  PE.mapAndFlatten = f => fa => fa.then(Eth.map(f)).then(PE.propagateAndFlatten);
  PE.resolveAndThrow = promisedEither => promisedEither.then(either => {
    if (Eth.isLeft(either)) {
      throw either.left;
    }
    return either.right;
  });
})(PE || (exports.PE = PE = {}));
const _throw = error => {
  throw error;
};
exports._throw = _throw;
const _id = error => error;
exports._id = _id;
const _stub = () => Eth.left(new Error("Unknown Error"));
exports._stub = _stub;
class E {
  constructor() {
    _defineProperty(this, "abc", 5);
  }
}