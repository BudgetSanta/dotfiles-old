#!/usr/bin/env bash

function resize
{
    while [[ "$1" ]]; do
        chunkc tiling::window --use-temporary-ratio "$1" --adjust-window-edge "$2"
        shift; shift
    done
}

function main
{
    case "${1:0:1}" in
        "l") resize "0.01" "west" "-0.01" "east" ;;
        "r") resize "0.01" "east" "-0.01" "west" ;;
        "d") resize "0.01" "south" "-0.01" "north" ;;
        "u") resize "0.01" "north" "-0.01" "south" ;;
    esac
}

main "$@"
