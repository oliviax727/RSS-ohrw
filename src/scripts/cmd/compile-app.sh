(
    # Compile to js folder
    tsc

    # Babelify
    ./node_modules/.bin/babel ./src/scripts/js --out-dir ./src/scripts/lib

    # Browserify
    browserify ./src/scripts/entry.js | terser --compress > ./src/scripts/bundle.js
)