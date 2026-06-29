"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHTML = exports.getXML = exports.getJSON = exports.getFeedMap = void 0;
var _defaultModules = require("./default-modules.js");
var _rssParser = _interopRequireDefault(require("rss-parser"));
var TE = _interopRequireWildcard(require("fp-ts/TaskEither"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Parsers
const rssParser = new _rssParser.default();
const domParser = new DOMParser();
// ===== HTML HANDLING ===== //
// Parse a string to a HTML file
const parseHTML = html => domParser.parseFromString(html, "text/html").body;
// ===== JSON HANDLING ===== //
// Get the JSON data as a feed map
exports.parseHTML = parseHTML;
const getFeedMap = fileName => TE.map(jsonModule => {
  const protoFeed = jsonModule.default ?? jsonModule;
  return new Map(Object.entries(protoFeed).map(([feedName, entryRecord]) => [feedName, Object.entries(entryRecord).map(([name, link]) => ({
    name,
    link
  }))]));
})(getJSON("./src/data/" + fileName + ".json"));
// Retreive JSON file
exports.getFeedMap = getFeedMap;
const getJSON = file => TE.tryCatch(() => import(file, {
  with: {
    type: "json"
  }
}), _defaultModules._id);
// ===== XML HANDLING ===== //
// Retreive XML RSS file
exports.getJSON = getJSON;
const getXML = file => TE.flatMap(textXML => TE.tryCatch(() => rssParser.parseString(textXML), _defaultModules._id))(TE.orElse(() => tryGetXML((0, _defaultModules.getProxyURL)(file)))(tryGetXML(file)));
// Attempts to get an XML file (sub-function of getXML)
exports.getXML = getXML;
const tryGetXML = url => TE.tryCatch(() => fetch(url).then(responseXML => {
  if (responseXML.ok) {
    return responseXML.text();
  }
  throw new Error("A error occured HTTP. Code: " + responseXML.status.toString());
}).catch(reason => {
  throw reason;
}), _defaultModules._id);