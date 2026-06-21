/// <reference types="node" />

import { _id, type EntryFunction } from "./rss-modules";

const main: EntryFunction = async function () {
    console.log("Display RSS");
    await new Promise(_id);
}

export default main;