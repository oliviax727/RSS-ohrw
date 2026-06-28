/// <reference types="node" />

import * as T from "fp-ts/Task";
import * as Console from "fp-ts/Console";
import { decideUnsafe, type EntryFunction, type OutputFunction } from './default-modules';
import { createFeed, createFeedList } from "./rss-modules.js";

const getRSS: OutputFunction = async function () {
	const feed = await decideUnsafe(createFeed("newsreader", "test-feed"));

	return feed;
};

const displayNewsreaderLinks = async function () {
	return await decideUnsafe(createFeedList("newsreader"));
};

const displayRSS: OutputFunction = function () { 
	return "Display RSS";
};

const dismissRSSItem: OutputFunction = function () {
	return "Dismiss RSS Item";
};

const loadRSS: EntryFunction = async function () {
	console.log("Loading RSS Feed ...");

	try {
		await T.traverseSeqArray((func: OutputFunction) => async () => {
			const output = await func();
			Console.log(output)();
		})([getRSS, displayRSS, dismissRSSItem])();
	} catch (error: unknown) {
		console.log("An error occured while trying to load the bundled modules: " + (error as string) + ";");

		if (error instanceof Error) {
			console.log("In: " + (error.stack ?? "[stack unavailable]"));
		} else {
			console.trace();
		}
	} finally {
		console.log("Loaded RSS Feed");
	}
};

export { loadRSS, displayNewsreaderLinks };
