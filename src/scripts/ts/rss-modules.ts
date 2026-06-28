/// <reference types="node" />

import { _id, HTTPS404 } from "./default-modules.js";
import Parser from "rss-parser";
import type { TaskEither } from "fp-ts/TaskEither";
import * as TE from "fp-ts/TaskEither";

// ===== LOAD RSS INTO HTML ===== //

// ===== LOAD XML INTO RSS ===== //

// JSON File Data
interface EntryURL {
	name: string;
	link: string;
}

// JSON Module types
interface JSONModule {
	default?: unknown;
}

type JSONFeedRecord = Readonly<Record<string, Readonly<Record<string, string>>>>;

// JSON File Data Container
type FeedMap = Map<string, EntryURL[]>;

// RSS parent data
interface ParentData {
	uuid: number;
	name: string;

	title: string;
	link: string;

	imageUrl?: string;
	imageName?: string;
}

// RSS entry object
interface Entry {
	uuid: number;

	title: string;
	link: string;
	description: string;

	date?: Date;

	parentData: ParentData;

	read: boolean;
	dismissed: boolean;
}

// RSS Feed
export function createFeed(jsonFile: string, feedName: string): TaskEither<unknown, Entry[]> {
	return TE.map(sortFeed)(TE.flatMap(loadXML)(loadJSON(jsonFile, feedName)));
}

// Load a JSON file and then return the selected feed
function loadJSON(file: string, selection: string): TaskEither<unknown, EntryURL[]> {
	return TE.flatMap((feed: FeedMap) => {
		const selectedFeed = feed.get(selection);

		return selectedFeed !== undefined
			? TE.right(selectedFeed)
			: TE.left(new Error("Selected feed does not exist in JSON"));
	})(getFeedMap(file));
}

// Generate the collection of items based on the feed
function loadXML(urlList: readonly EntryURL[]): TaskEither<unknown, Entry[]> {
	return TE.map((entries: readonly Entry[][]) => entries.flat())(
		TE.traverseArray((urlEntry: Readonly<EntryURL>) =>
			TE.map((feedData: Readonly<Parser.Output<object>>) => parsedXMLToEntries(feedData, urlEntry.name))(
				getXML(urlEntry.link),
			),
		)(urlList),
	);
}

// Sort feed array based on date
function sortFeed(entryList: readonly Entry[]): Entry[] {
	return [...entryList].sort((a: Readonly<Entry>, b: Readonly<Entry>) => {
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
function parsedXMLToEntries(xmlData: Readonly<Parser.Output<object>>, feedName: string): Entry[] {
	return xmlData.items.map((item: Readonly<Parser.Item>) =>
		itemToEntry(item, channelToParentData(xmlData, feedName)),
	);
}

// Load parent channel data into ParentData object
function channelToParentData(xmlData: Readonly<Parser.Output<object>>, feedName: string): ParentData {
	return {
		uuid: uuidURL(xmlData.link ?? HTTPS404),
		name: feedName,
		title: xmlData.title ?? "Title not found.",
		link: xmlData.link ?? HTTPS404,
		imageName: xmlData.image?.title,
		imageUrl: xmlData.image?.url,
	};
}

function itemToEntry(xmlItem: Readonly<Parser.Item>, itemParent: Readonly<ParentData>): Entry {
	return {
		uuid: uuidURL(xmlItem.link ?? itemParent.link),
		link: xmlItem.link ?? itemParent.link,
		title: xmlItem.title ?? itemParent.title,
		description: xmlItem.contentSnippet ?? "Description not found.",
		date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
		parentData: itemParent,
		read: false,
		dismissed: false,
	};
}

// ===== FILE AND FETCH HANDLING ===== //

const rssParser = new Parser<object, object>();

function uuidURL(url: string, seed = 5381): number {
	return (
		Array.from(url).reduce(
			// hash * 33 + charCode (bitwise shift for efficiency: hash << 5 is hash * 32)
			(seed: number, char: string) => (seed << 5) + seed + char.charCodeAt(0),
			seed,
		) >>> 0
	);
}

// Get the JSON data as a feed map
function getFeedMap(fileName: string): TaskEither<unknown, FeedMap> {
	return TE.map((jsonModule: Readonly<JSONModule>) => {
		const protoFeed = ((jsonModule.default ?? jsonModule) as JSONFeedRecord);

		return new Map(
			Object.entries(protoFeed).map(([feedName, entryRecord]) => [
				feedName,
				Object.entries(entryRecord).map(([name, link]) => ({ name, link })),
			]),
		);
	})(getJSON("./src/data/"+fileName+".json"));
}

// Retreive JSON file
function getJSON(file: string): TaskEither<unknown, JSONModule> {
	return TE.tryCatch(
		() => import(file, { with: { type: "json" } }) as Promise<JSONModule>,
		_id
	);
}

// Retreive XML file
function getXML(file: string): TaskEither<unknown, Parser.Output<object>> {
	return TE.flatMap((textXML: string) => TE.tryCatch(() => rssParser.parseString(textXML), _id))(
		TE.tryCatch(
			() =>
				fetch(file).then((responseXML: Response) => {
					if (responseXML.ok) {
						return responseXML.text();
					} else {
						throw new Error("A error occured HTTP. Code: " + responseXML.status.toString());
					}
				}),
			_id,
		),
	);
}
