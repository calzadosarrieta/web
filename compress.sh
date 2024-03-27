#!/bin/bash


# String to replace
find "$1" -type f -name "*.jpg" -or -name "*.gif" -or -name "*.jpeg"  | while IFS= read -r -d '' file; do
    cwebp "$file" -o "${file%.*}.webp"
    #rm "$file"
done

