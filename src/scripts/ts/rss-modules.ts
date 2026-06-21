/// <reference types="node" />

import Parser from 'rss-parser';
import type { Either } from 'fp-ts/Either';
import type { LazyArg } from 'fp-ts/function';
import * as Eth from 'fp-ts/Either';

// ===== LOAD RSS INTO HTML ===== //


// ===== LOAD XML INTO RSS ===== //

// JSON File Data
interface EntryURL {
    name: string;
    link: string;
}

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
export async function createFeed(jsonFile: string, feedName: string): PromiseEither<unknown, Entry[]> {
    return PE.map(sortFeed)(PE.mapAndFlatten(loadXML)(loadJSON(jsonFile, feedName)));
}

async function loadJSON(file: string, selection: string): PromiseEither<unknown, EntryURL[]> {
    await getXML("");
    return _stub();
}

// Generate the collection of items based on the feed
export async function loadXML(urlList: EntryURL[]): PromiseEither<unknown, Entry[]> {

    const promisedEntries = urlList.map(async (urlEntry: EntryURL) => {
        console.log("Getting data for: " + urlEntry.name);

        return PE.map(
            (feedData: Parser.Output<object>) => parsedXMLToEntries(feedData, urlEntry.name)
        )(getXML(urlEntry.link))
    });

    return promisedEntries.reduce(
        (accPE, arrPE) =>
            Promise.all([accPE, arrPE]).then(([acc, arr]) =>
                Eth.isLeft(arr) ? acc : Eth.right([...(Eth.isLeft(acc) ? [] : acc.right), ...arr.right])
            ),
        Promise.resolve(Eth.right([] as Entry[]))
    );
}

// Sort feed array based on date
function sortFeed(entryList: Entry[]): Entry[] {
    return entryList.sort((a: Entry, b: Entry) => {
        if (a.dismissed != b.dismissed) {
            return (+a.dismissed) - (+b.dismissed)
        } else if (a.date !== undefined && b.date !== undefined) {
            return (+b.date) - (+a.date);
        } else {
            return b.uuid - a.uuid;
        }
    })
}

// Parsed XML data to entry
function parsedXMLToEntries(xmlData: Parser.Output<object>, feedName: string): Entry[] {
    return xmlData.items.map(
        (item: Parser.Item) => itemToEntry(item, channelToParentData(xmlData, feedName))
    );
}

// Load parent channel data into ParentData object
function channelToParentData(xmlData: Parser.Output<object>, feedName: string): ParentData {
    return {
        uuid: uuidURL(xmlData.link as string),
        name: feedName,
        title: xmlData.title as string,
        link: xmlData.link as string,
        imageName: xmlData.image?.title,
        imageUrl: xmlData.image?.url
    };
}

function itemToEntry(xmlItem: Parser.Item, itemParent: ParentData): Entry {
    return {
        uuid: uuidURL(xmlItem.link as string),
        link: xmlItem.link as string,
        title: xmlItem.title as string,
        description: xmlItem.contentSnippet as string,
        date: typeof xmlItem.pubDate === "string" ? new Date(xmlItem.pubDate) : undefined,
        parentData: itemParent,
        read: false,
        dismissed: false
    };
}

// ===== FILE AND FETCH HANDLING ===== //

const rssParser = new Parser<object, object>();

function uuidURL(url: string): number {
    function getHash(str: string, seed = 5381) {
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
async function getXML(url: string): PromiseEither<unknown, Parser.Output<object>> {
    return PE.mapAndFlatten(
        (textXML: string) =>
            PE.tryCatch(
                () => rssParser.parseString(textXML),
                _id
            )
    )(
        PE.tryCatch(
            () => fetch(url).then((responseXML: Response) => {
                if (responseXML?.ok) {
                    return responseXML.text();
                } else {
                    throw new Error("A error occured HTTP. Code: " + responseXML.status.toString());
                }
            }),
            _id
        )
    )
}

// ===== TYPE EXPORTS ===== //

export type EntryFunction = () => Promise<void>;

export type PromiseEither<E, A> = Promise<Either<E, A>>;

export namespace PE {

    export const fromPromise = <E, A>(outerEither: Either<E, Promise<A>>): PromiseEither<E, A> =>
        Eth.isLeft(outerEither)
            ? Promise.resolve(Eth.left<E, A>(outerEither.left))
            : outerEither.right.then((value: A) => Eth.right<E, A>(value));

    export const propagate = <E, A>(outerEither: Either<E, PromiseEither<E, A>>): PromiseEither<E, Either<E, A>> =>
        fromPromise(outerEither);

    export const tryCatch = <E, A>(f: LazyArg<Promise<A>>, onthrow: (e: unknown) => E): PromiseEither<E, A> =>
        fromPromise(Eth.tryCatch(f, onthrow));

    export const propagateAndFlatten = <E, A>(outerEither: Either<E, PromiseEither<E, A>>): PromiseEither<E, A> =>
        propagate(outerEither).then(Eth.flatten);

    export const flatten = <E, A>(outerPromise: PromiseEither<E, PromiseEither<E, A>>): PromiseEither<E, A> =>
        outerPromise.then(propagateAndFlatten);

    export const map = <A, B, E>(f: (a: A) => B): ((fa: PromiseEither<E, A>) => PromiseEither<E, B>) =>
        <E>(fa: PromiseEither<E, A>) => fa.then(Eth.map(f));

    export const mapAndFlatten = <A, B, E>(f: (a: A) => PromiseEither<E, B>): ((fa: PromiseEither<E, A>) => PromiseEither<E, B>) =>
        (fa: PromiseEither<E, A>) => fa.then(Eth.map(f)).then(propagateAndFlatten);

    export const resolveAndThrow = <Err, A>(promisedEither: PromiseEither<Err, A>): Promise<A> =>
        promisedEither.then((either: Either<Err, A>) => {
            if (Eth.isLeft(either)) {
                throw either.left;
            }

            return either.right;
        })

}

export const _throw = (error: unknown): void => { throw error; };
export const _id = <A>(error: A): A => error;
export const _stub = (): Either<unknown, any> => Eth.left(new Error("Unknown Error") as unknown);

class E {
    abc = 5;
    
}