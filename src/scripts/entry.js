console.log("Testing import ...");

try {
    await import('https://esm.sh/test-import');
} catch (error) {
    console.log("Entry imports don't work: "+error);
} finally {
    console.log("Entry javascript integrated. Imports work!");
}

import fs from "https://esm.sh/file-system";

/*
fs.readdir('./js', (err, files) => {
    files.forEach(async file => {
        const module = await import('./' + file)
        console.log("Imported: "+file);
    });
});
*/