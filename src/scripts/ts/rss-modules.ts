/// <reference types="node" />

import { HTTPS404, uuidURL } from "./default-modules.js";
import { getFeedMap, getXML, parseHTML } from "./file-handler-moules.js";
import type { EntryURL, FeedMap, rssData, rssItem } from "./file-handler-moules.js";
import type { TaskEither } from "fp-ts/TaskEither";
import * as TE from "fp-ts/TaskEither";
import * as M from "fp-ts/Map";

// ===== TYPE DEFINITIONS ===== //

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

// ===== TOP-LEVEL HTML RETURNS ===== //

// Produce RSS Feed as HTML object
/*export function createFeedHTML(jsonFile: string, feedName: string): TaskEither<unknown, HTMLElement> {

}*/

// Produce list of RSS feed sources as HTML object
export function createFeedList(jsonFile: string): TaskEither<unknown, HTMLElement> {
	return TE.map((feedMap: FeedMap) => {
		return parseHTML(
			Array.from(
				M.map((entryUrlList: readonly EntryURL[]) => {
					return entryUrlList.reduce(
						(acc, val) => acc + "<li><a href='" + val.link + "'>" + val.name + "</a></li>\n",
						"",
					);
				})(feedMap),
			).reduce((acc, [key, val]) => acc + "<h4>" + key + "</h4>\n<ul>\n" + val + "</ul>\n", ""),
		);
	})(getFeedMap(jsonFile));
}

// ===== LOAD JSON INTO XML INTO RSS ===== //

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
			TE.map((feedData: Readonly<rssData>) => parsedXMLToEntries(feedData, urlEntry.name))(
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

// ===== PARSE XML DATA ===== //

// Parsed XML data to entry
function parsedXMLToEntries(xmlData: Readonly<rssData>, feedName: string): Entry[] {
	return xmlData.items.map((item: Readonly<rssItem>) =>
		itemToEntry(item, channelToParentData(xmlData, feedName)),
	);
}

// Load parent channel data into ParentData object
function channelToParentData(xmlData: Readonly<rssData>, feedName: string): ParentData {
	return {
		uuid: uuidURL(xmlData.link ?? HTTPS404),
		name: feedName,
		title: xmlData.title ?? "Title not found.",
		link: xmlData.link ?? HTTPS404,
		imageName: xmlData.image?.title,
		imageUrl: xmlData.image?.url,
	};
}

function itemToEntry(xmlItem: Readonly<rssItem>, itemParent: Readonly<ParentData>): Entry {
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
