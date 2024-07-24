#!/bin/bash

script_dir=$(dirname "$0")
source "$script_dir/.env"

#############################################
# Useful functions for other scripts to use #
#############################################

die() {
  printf "Process failed with error $!\n"
  exit 1
}