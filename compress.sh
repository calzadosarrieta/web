#!/bin/bash



origin=".jpg"
destination=""

# String to replace
find "$1" -type f -not -name "*.webp" -print0  | while IFS= read -r -d '' file; do
    #echo "$file"
    output="${file/$origin/$destination}.webp"
    #echo "$output"
    cwebp "$file" -o "$output"
    rm "$file"
done

