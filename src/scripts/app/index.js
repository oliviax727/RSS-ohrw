"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getRss = _interopRequireDefault(require("./get-rss"));
var _displayRss = _interopRequireDefault(require("./display-rss"));
var _dismissRssItem = _interopRequireDefault(require("./dismiss-rss-item"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/// <reference types="node" />

const entry = async function () {
  console.log("Loading bundled modules ...");
  try {
    await (0, _getRss.default)();
    await (0, _displayRss.default)();
    await (0, _dismissRssItem.default)();
  } catch (error) {
    console.log("An error occured while trying to load the bundled modules: " + error + ";");
    if (error instanceof Error) {
      console.log("In: " + error.stack);
    } else {
      console.trace();
    }
  } finally {
    console.log("Modules successfully loaded.");
  }
};
var _default = exports.default = entry;