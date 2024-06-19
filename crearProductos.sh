#!/bin/bash


# String to replace
origin="img/productos"
destination="productos"

# https://gist.github.com/oneohthree/f528c7ae1e701ad990e6
slugify() {
    slug=$(echo "$1" | xargs -0 printf '%b\n' | iconv -t ascii//TRANSLIT  | tr '[:upper:]' '[:lower:]' | tr 'áéíóúüñ' 'aeiouun' | sed -E -e 's/[^[:alnum:]\/]+/-/g' -e 's/^-+|-+$//g')
    echo "$slug"
}


# Function to create YAML file
create_yaml() {
    #echo "$1"
    local filepath="$1"
    local fullname=$(basename "$filepath")
    local filename="${fullname%.*}"
    local dir="$(dirname "$filepath")"
    dir=$(slugify "${dir/$origin/$destination}")

    # Split filename into an array using the separator |
    IFS="=" read -r -a filename_parts <<< "$filename"

    slug=$(slugify "${filename_parts[0]}")

    mkdir -p "$dir"

    if [[ $fullname =~ "destacado-3" ]]; then order="3";
    elif [[ $fullname =~ "destacado-2" ]]; then order="2";
    elif [[ $fullname =~ "destacado" ]]; then order="1";
    else order="0"; fi;

    # Append number to duplicated files
    if [ -e "$dir/$slug.md" ]; then
        for i in 2 3 4 5 6 7 8 9; do
            if [ ! -e "$dir/$slug-$i.md" ]; then
                slug="${slug}-${i}"
                break
            fi
        done
    fi

    # Create YAML content
if [[ -z "$2" ]]; then
echo "---
layout: product
title: ${filename_parts[0]}
image: $filepath
price: ${filename_parts[1]}
tags: ${filename_parts[2]}
description: ${filename_parts[3]}
order: $order
---" > "$dir/$slug.md";
elif [[ "$dir/$slug" != "$2"  ]]; then
echo "---
layout: product
redirect: $2.html
---" > "$dir/$slug.md"
fi

    echo "$dir/$slug"
}



detect_changes(){

    # Get a list of renamed files
    git add .
    renamed_files=$(git diff --name-status --find-renames --staged img/productos/ | xargs -0 printf '%b\n')

    # Loop through each renamed file
    while IFS= read -r line; do
        status=$(echo "$line" | cut -d$'\t' -f1)
        old_name=$(echo "$line" | cut -d$'\t' -f2)
        new_name=$(echo "$line" | cut -d$'\t' -f3)
        
        if [[ "$status" == "R"* ]]; then
            echo "Renamed $old_name => $new_name"
            # Create yalm for new file
            new_slug=$( create_yaml "$new_name" )
            # Update yalm for old file pointing to new file
            create_yaml "$old_name" "$new_slug"

        elif [[ "$status" == "A"* ]]; then
            echo "Added $old_name"
            #create_yaml "$new_name"
        elif [[ "$status" == "D"* ]]; then
            echo "Deleted $old_name"
        fi
    done <<< "$renamed_files"
}


#detect_changes

rm -rf productos/*
# Find all files within the specified subfolder and create YAML files
find "$origin" -type f -print0 | while IFS= read -r -d '' file; do
   create_yaml "$file"
done

#read -p "Press enter to continue"