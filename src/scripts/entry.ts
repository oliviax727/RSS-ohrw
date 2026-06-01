import { urlBuilder } from "npm2url";

const url: string = urlBuilder.getFullUrl('npm2url');
const url2: string = urlBuilder.getFullUrl('npm2url', 'jsdelivr');

// find the fastest provider
await urlBuilder.findFastestProvider();
const fastestUrl = urlBuilder.getFullUrl('npm2url');

// find the fastest provider temporarily
const fastest = await urlBuilder.getFastestProvider();
const fastestUrlTemporary = urlBuilder.getFullUrl('npm2url', fastest);

console.log(url);
console.log(fastestUrl);
console.log(url2);
console.log(fastestUrlTemporary);
