(
    # Compile to js folder
    tsc

    # Compile app folder
    cp -r ./src/scripts/js/* ./src/scripts/app/

    js_files=(./src/scripts/app/*)
    line_regex='^(?!(.*(\/\/)))(import\h+(\S+\h+)+from\s+)('\''\S+'\'')(\h|;)*$'
    modl_regex='(?<=from\s'\'')(\w|[\-\_\.])+(?='\''|\h|;)'
    cdn_http='https://cdn.jsdelivr.net/npm/'

    for js_file in "${js_files[@]}"; do
        line="$(ggrep -oP "$line_regex" $js_file)"
        item="$(echo "$line" | ggrep -oP "$modl_regex")"
        new_line="${line/$item/$cdn_http$item}"
        if [[ -n "$line" ]]; then
            echo "$new_line"
            gsed -i "s|$line|$new_line|" $js_file
        fi
    done
)