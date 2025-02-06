#!/bin/bash

find . -name "*.scss" -print0 | while IFS= read -r -d $'\0' file; do
  sed -i 's/@import.*mixins.*;/@import "\.\.\/app\/mixins";/g' "$file"
done
