"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadRSS = exports.displayNewsreaderLinks = void 0;
var T = _interopRequireWildcard(require("fp-ts/Task"));
var Console = _interopRequireWildcard(require("fp-ts/Console"));
var _defaultModules = require("./default-modules");
var _rssModules = require("./rss-modules.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/// <reference types="node" />

const getRSS = async () => await (0, _defaultModules.decideUnsafe)((0, _rssModules.createFeed)("newsreader", "test-feed"));
const displayNewsreaderLinks = async () => await (0, _defaultModules.decideUnsafe)((0, _rssModules.createFeedList)("newsreader"));
exports.displayNewsreaderLinks = displayNewsreaderLinks;
const displayRSS = () => "Display RSS";
const dismissRSSItem = () => "Dismiss RSS Item";
const loadRSS = async function () {
  console.log("Loading RSS Feed ...");
  try {
    await T.traverseSeqArray(func => async () => {
      const output = await func();
      Console.log(output)();
    })([getRSS, displayRSS, dismissRSSItem])();
  } catch (error) {
    console.log("An error occured while trying to load the bundled modules: " + error + ";");
    if (error instanceof Error) {
      console.log("In: " + (error.stack ?? "[stack unavailable]"));
    } else {
      console.trace();
    }
  } finally {
    console.log("Loaded RSS Feed");
  }
};
exports.loadRSS = loadRSS;