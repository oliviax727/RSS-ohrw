/// <reference types="node" />

import * as T from "fp-ts/Task";
import * as Console from "fp-ts/Console";
import { decideUnsafe } from './default-modules';
import type { EntryFunction, OutputFunction } from './default-modules';
import { createFeed, createFeedList } from "./rss-modules.js";
import type { Entry } from "./rss-modules.js";

const getRSS: OutputFunction<Entry[]> = async () => await decideUnsafe(createFeed("newsreader", "test-feed"));

const displayNewsreaderLinks: OutputFunction<HTMLElement> = async () => await decideUnsafe(createFeedList("newsreader"));

const displayRSS: OutputFunction<string> = () => "Display RSS";

const dismissRSSItem: OutputFunction<string> = () => "Dismiss RSS Item";

const loadRSS: EntryFunction = async function () {
	console.log("Loading RSS Feed ...");

	try {
		await T.traverseSeqArray((func: OutputFunction<unknown>) => async () => {
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
