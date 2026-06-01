html_files=(src/html/*.html)

local_html_file=$(cat src/layout/content-template.html)

for html in "${html_files[@]}"
do
    if [ "$html" != "src/html/primary.html" ]; then
        echo "$local_html_file" > $html
    fi
done