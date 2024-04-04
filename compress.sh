#!/bin/bash



origin=".jpg"
destination=""

# String to replace
find "img/" -type f -not -name "*.webp" -print0  | while IFS= read -r -d '' file; do
    output="${file%.*}.webp"
    #output="${file/$origin/$destination}.webp"
    echo "$file => $output"
    libwebp/bin/cwebp -size 100 "$file" -o "$output"
    rm "$file"
done
