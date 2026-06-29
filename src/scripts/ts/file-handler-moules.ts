import { _id, getProxyURL } from "./default-modules.js";
import Parser from "rss-parser";
import type { TaskEither } from "fp-ts/TaskEither";
import * as TE from "fp-ts/TaskEither";

// ===== IMPORTANT TYPES AND CONSTANTS ===== //

// JSON File Data
export interface EntryURL {
	name: string;
	link: string;
}

// JSON Module types
interface JSONModule {
	default?: unknown;
}

// JSON RSS Feed Record and corresponding map
type JSONFeedRecord = Readonly<Record<string, Readonly<Record<string, string>>>>;
export type FeedMap = Map<string, EntryURL[]>;

// Parsers
const rssParser = new Parser<object, object>();
const domParser = new DOMParser();

// RSS Parser return data
export type rssData = Parser.Output<object>;
export type rssItem = Parser.Item;

// ===== HTML HANDLING ===== //

// Parse a string to a HTML file
export const parseHTML = (html: string): HTMLElement => domParser.parseFromString(html, "text/html").body;

// ===== JSON HANDLING ===== //

// Get the JSON data as a feed map
export const getFeedMap = (fileName: string): TaskEither<unknown, FeedMap> =>
	TE.map((jsonModule: Readonly<JSONModule>) => {
		const protoFeed = (jsonModule.default ?? jsonModule) as JSONFeedRecord;

		return new Map(
			Object.entries(protoFeed).map(([feedName, entryRecord]) => [
				feedName,
				Object.entries(entryRecord).map(([name, link]) => ({ name, link })),
			]),
		);
	})(getJSON("./src/data/" + fileName + ".json"));

// Retreive JSON file
export const getJSON = (file: string): TaskEither<unknown, JSONModule> =>
	TE.tryCatch(() => import(file, { with: { type: "json" } }) as Promise<JSONModule>, _id);

// ===== XML HANDLING ===== //

// Retreive XML RSS file
export const getXML = (file: string): TaskEither<unknown, Parser.Output<object>> =>
	TE.flatMap((textXML: string) => TE.tryCatch(() => rssParser.parseString(textXML), _id))(
		TE.orElse(() => tryGetXML(getProxyURL(file)))(tryGetXML(file)),
	);

// Attempts to get an XML file (sub-function of getXML)
const tryGetXML = (url: string): TaskEither<unknown, string> =>
	TE.tryCatch(
		() =>
			fetch(url)
				.then((responseXML: Response) => {
					if (responseXML.ok) {
						return responseXML.text();
					}

					throw new Error("A error occured HTTP. Code: " + responseXML.status.toString());
				})
				.catch((reason: unknown) => {
					throw reason;
				}),
		_id,
	);
