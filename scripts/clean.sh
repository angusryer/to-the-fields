#!/bin/bash

# Source the shared functions
base_dir=$(dirname "$0")

echo "Base dir $base_dir"

source "$base_dir/shared.sh"

# Resolve absolute path for mobile_dir
absolute_mobile_dir=$(realpath "$base_dir/$mobile_dir")

echo "Cleaning mobile project..."

# Debugging: Print the value of mobile_dir
echo "Mobile directory: $absolute_mobile_dir"

if [[ ! -d "$absolute_mobile_dir" ]]; then
  echo "Error: Directory $absolute_mobile_dir does not exist."
  die
fi

pushd "$absolute_mobile_dir"
  yarn clean
popd

if [[ $? -ne 0 ]]; then
  die $?
fi