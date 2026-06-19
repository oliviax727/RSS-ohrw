"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadRSS = void 0;
exports.default = rssApi;
var _rssParser = _interopRequireDefault(require("rss-parser"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /// <reference types="node" />
function rssApi() {
  console.log("rss-api module loaded");
}
var LoadRSS;
(function (LoadRSS) {
  // Load RSS object from XML
  let ObjectXML;
  (function (ObjectXML) {
    // RSS Feed
    class Feed {
      constructor(urlList) {
        _defineProperty(this, "urlList", void 0);
        _defineProperty(this, "entryList", new Array());
        this.urlList = urlList;
      }
      // Generate the collection of items based on the feed
      async createFeed() {
        const promisedEntries = Array.from(this.urlList).map(async ([name, url]) => {
          console.log("Getting data from: " + url);
          const feedData = await RSSHelper.getXML(url);
          if (feedData == undefined) {
            return undefined;
          }
          const entriesToAdd = this.parsedXMLToEntries(feedData, name);
          return entriesToAdd;
        });
        const unconcatenatedEntries = await Promise.all(promisedEntries);
        unconcatenatedEntries.forEach(entrySet => {
          if (entrySet != undefined) {
            this.entryList = [...this.entryList, ...entrySet];
          }
        });
        this.sortFeed();
      }
      // Sort feed array based on date
      sortFeed() {
        this.entryList.sort((a, b) => {
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
      parsedXMLToEntries(xmlData, feedName) {
        const channelData = this.channelToParentData(xmlData, feedName);
        let entries = new Set(xmlData.items.map(item => {
          return this.itemToEntry(item, channelData);
        }));
        return entries;
      }
      // Load parent channel data into ParentData object
      channelToParentData(xmlData, feedName) {
        return {
          uuid: RSSHelper.uuidURL(xmlData.link),
          name: feedName,
          title: xmlData.title,
          link: xmlData.link,
          imageName: xmlData.image?.title,
          imageUrl: xmlData.image?.url
        };
      }
      itemToEntry(xmlItem, itemParent) {
        return {
          uuid: RSSHelper.uuidURL(xmlItem.link),
          link: xmlItem.link,
          title: xmlItem.title,
          description: xmlItem.contentSnippet,
          date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
          parentData: itemParent,
          read: false,
          dismissed: false
        };
      }
    }
    ObjectXML.Feed = Feed;
  })(ObjectXML = LoadRSS.ObjectXML || (LoadRSS.ObjectXML = {}));
  // Helper functions for the LoadRSS
  let RSSHelper;
  (function (RSSHelper) {
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
    RSSHelper.uuidURL = uuidURL;
    // Retreive XML file
    async function getXML(url) {
      let responseXML = undefined;
      try {
        responseXML = await fetch(url);
      } catch (error) {
        console.log("An unknown error occured while fetching the XML file: " + url + ";\n" + error);
      } finally {
        if (responseXML?.ok) {
          const textXML = await responseXML.text();
          return await rssParser.parseString(textXML);
        } else {
          console.log("A error occured HTTP. Code: " + responseXML?.status);
        }
      }
      return undefined;
    }
    RSSHelper.getXML = getXML;
  })(RSSHelper = LoadRSS.RSSHelper || (LoadRSS.RSSHelper = {}));
})(LoadRSS || (exports.LoadRSS = LoadRSS = {}));