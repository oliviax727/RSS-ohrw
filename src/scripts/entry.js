console.log("Testing import ...");

try {
    await import('https://esm.sh/test-import');
} catch (error) {
    console.log("Entry imports don't work: "+error);
} finally {
    console.log("Entry javascript integrated. Imports work!");
}

import Parser, {} from 'https://esm.sh/rss-parser';