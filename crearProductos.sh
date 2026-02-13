#!/bin/bash


# String to replace
origin="img/productos"
destination="productos"

# https://gist.github.com/oneohthree/f528c7ae1e701ad990e6
slugify() {
    slug=$(echo "$1" | xargs -0 printf '%b\n' | tr '[:upper:]' '[:lower:]' | sed -E -e 's/ñ|Ñ/n/g' -e 's/á|Á/a/g' -e 's/é|É/e/g' -e 's/í|Í/i/g' -e 's/ó|Ó/o/g' -e 's/ú|Ú/u/g' | sed -E -e 's/[^[:alnum:]\/]+/-/g' -e 's/^-+|-+$//g')
    echo "$slug"
}


# Function to create YAML file
create_yaml() {
    #echo "$1"
    local filepath="$1"
    local fullname=$(basename "$filepath")
    local filename="${fullname%.*}"
    local md5=$( md5sum "$filepath" | cut -c 1-16) # Collision Prob -> https://kevingal.com/apps/collision.html
    local short=$( echo "$md5" | cut -c 1-3)
    local dir="$(dirname "$filepath")"
    dir=$(slugify "${dir/$origin/$destination}")
    #local dir="$destination"
    

    # Split filename into an array using the separator |
    IFS="=" read -r -a filename_parts <<< "$filename"

    slug=$(slugify "${filename_parts[0]}")
    slug="${slug}-${short}"

    mkdir -p "$dir"

    if [[ $fullname =~ "destacado-3" ]]; then order="3";
    elif [[ $fullname =~ "d3" ]]; then order="3";
    elif [[ $fullname =~ "destacado-2" ]]; then order="2";
    elif [[ $fullname =~ "d2" ]]; then order="2";
    elif [[ $fullname =~ "destacado" ]]; then order="1";
    elif [[ $fullname =~ "d1" ]]; then order="1";
    elif [[ $fullname =~ "zzz" ]]; then order="-1";
    else order="0"; fi;

    
    

    # Create YAML content date: $(date +%s -r "$filepath")

if [[ -z "$2" ]]; then
echo "---
layout: product
id: $md5
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
find "$origin" -type f -print0 | sort -z | while IFS= read -r -d '' file; do
   create_yaml "$file"
done

#read -p "Press enter to continue"