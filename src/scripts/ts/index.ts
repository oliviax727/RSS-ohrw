/// <reference types="node" />

import { default as GetRSS } from './get-rss';
import { default as DisplayRSS } from './display-rss';
import { default as DismissRSSItem } from './dismiss-rss-item';
import type { EntryFunction } from './rss-modules';

const entry: EntryFunction = async function () {
    console.log("Loading bundled modules ...");
    
    try {
        await GetRSS();
        await DisplayRSS();
        await DismissRSSItem();
    } catch (error: unknown) {
        console.log("An error occured while trying to load the bundled modules: "+error+";");
        
        if (error instanceof Error) {
            console.log("In: " + error.stack);
        } else {
            console.trace();
        }
    } finally {
        console.log("Modules successfully loaded.");
    }
}

export default entry;