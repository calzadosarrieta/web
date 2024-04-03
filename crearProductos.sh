#!/bin/bash


# String to replace
origin="img/productos"
destination="productos"

# https://gist.github.com/oneohthree/f528c7ae1e701ad990e6
slugify() {
    slug=$(echo "$1" | iconv -t ascii//TRANSLIT | sed -E -e 's/[^[:alnum:]]+/-/g' -e 's/^-+|-+$//g' | tr '[:upper:]' '[:lower:]')
    echo "$slug"
}


# Function to create YAML file
create_yaml() {
    local filepath="$1"
    local fullname=$(basename "$filepath")
    local filename="${fullname%.*}"
    local dir="$(dirname "$filepath")"
    dir="${dir/$origin/$destination}"

    # Split filename into an array using the separator |
    IFS="=" read -r -a filename_parts <<< "$filename"

    slug=$(slugify "${filename_parts[0]}")

    mkdir -p "$dir"

    if [[ $fullname =~ "destacado-3" ]]; then order="3";
    elif [[ $fullname =~ "destacado-2" ]]; then order="2";
    elif [[ $fullname =~ "destacado" ]]; then order="1";
    else order="0"; fi;

    # Create YAML content
    echo "---
layout: product
title: ${filename_parts[0]}
image: $filepath
price: ${filename_parts[1]}
tags: ${filename_parts[2]}
description: ${filename_parts[3]}
order: $order
---" > "$dir/$slug.md"

}


rm -r "$destination"
# Find all files within the specified subfolder and create YAML files
find "$origin" -type f -print0 | while IFS= read -r -d '' file; do
    create_yaml "$file"
done