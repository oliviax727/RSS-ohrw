console.log("Entry javascript integrated.");

import entry from './app/index.js';

try {
	entry();
} catch (error) {
	console.log("The following error was encountered: "+error);
	console.log(error.stack);
}

