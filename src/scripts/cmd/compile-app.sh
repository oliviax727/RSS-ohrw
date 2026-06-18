<<comment
(
    # Clear app folder
    rm -rf ./src/scripts/app/*

    # Compile to js folder
    tsc

    # Compile app folder
    js_files=(./src/scripts/app/*)
    line_regex='^(?!(.*(\/\/)))(import\h+(\S+\h+)+from\s+)('\''\S+'\'')(\h|;)*$'
    modl_regex='(?<=from\s'\'')(\w|[\-\_\.])+(?='\''|\h|;)'
    cdn_http='https://esm.sh/'

    for js_file in "${js_files[@]}"; do
        line="$(ggrep -oP "$line_regex" $js_file)"
        item="$(echo "$line" | ggrep -oP "$modl_regex")"
        new_line="${line/$item/$cdn_http$item}"
        if [[ -n "$line" ]]; then
            gsed -i "s|$line|$new_line|" $js_file
        fi
    done
)
comment

(
    # Compile to js folder
    tsc

    # Babelify
    ./node_modules/.bin/babel ./src/scripts/js --out-dir ./src/scripts/lib

    # Browserify
    browserify ./src/scripts/entry.js -o ./src/scripts/script.js
)