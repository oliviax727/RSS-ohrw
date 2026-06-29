/// <reference types="node" />

import type { Either } from "fp-ts/Either";
import type { TaskEither } from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

// ===== TYPE EXPORTS ===== //

export const HTTPS404 = "https://oliviax727.github.io/404";

export type EntryFunction = () => Promise<void> | void;

export type OutputFunction = () => Promise<object | string> | object | string;

// ===== STANDARD HELPER FUNCTIONS ===== //

export const _id = <A>(error: A): A => error;

// eslint-disable-next-line functional/functional-parameters
export const _stub = (): TaskEither<Error, never> => TE.left(new Error("Unknown Error"));

export const decideUnsafe = <Err, A>(taskEither: TaskEither<Err, A>): Promise<A> =>
	taskEither().then((either: Either<Err, A>) => {
		if (E.isLeft(either)) {
			throw E.toError(either.left);
		}

		return either.right;
	});

// ===== URI FUNCTIONS ===== //

const RSS_CORS_PROXY = "https://rss-proxy.oliviahrwalters.workers.dev/?url=";

// Adds the cloudfare proxy to the URL
export const getProxyURL = (url: string): string => RSS_CORS_PROXY + encodeURIComponent(url);

// Convert a URL into a UUID
export const uuidURL = (url: string, seed = 5381): number =>
	Array.from(url).reduce(
		// hash * 33 + charCode (bitwise shift for efficiency: hash << 5 is hash * 32)
		(seed: number, char: string) => (seed << 5) + seed + char.charCodeAt(0),
		seed,
	) >>> 0;
