(
    # Remove contents of dist and app
    rm -rf ./src/scripts/dist ./src/scripts/app

    # Compile to js folder
    tsc

    # Babelify
    ./node_modules/.bin/babel ./src/scripts/dist --out-dir ./src/scripts/app

    # Browserify
    browserify ./src/scripts/entry.js | terser --compress > ./bundle.js
)