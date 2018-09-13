#!/bin/bash
#Colours for Echos L=Light, D=Dark, B=Bold
NC='\033[0m' # No Color
GREEN='\033[0;32m'
RED='\033[0;31m'
LB_BLUE='\033[1;94m'

####
#NOTE: .toLink file holds files
####

linkFile() {

    if [[ $# -le 1 || $# -ge 4 ]]; then
        >&2 echo -e "${RED}Invalid${NC} line in .toLink: \"$*\""
        >&2 echo -e "${LB_BLUE}Correct${NC} to: DOTFILES_FOLDER FILE [DEST_FOLDER]"

    else
        # If Dotfiles Dir exists
        if ! [[ -d $1 ]]; then
            >&2 echo "${RED}Error:${NC} [$1] not found in dotfiles"
        fi

        # If File exists in dotfiles
        if ! [[ -f "$1/$2" ]]; then
            >&2 echo "${RED}Error:${NC} [$2] not found in dotfiles"
        fi

        # No Destination Specified
        if [[ $# -eq 2 ]]; then
            if [[ -f ~/$2 ]]; then
                mv "$HOME/$2" "$HOME/$2.old"
                echo -e "${LB_BLUE}Moved${NC} ~/$2 to ~/$2.old"
            fi
            ln -s "$HOME/.dotfiles/$1/$2" "$HOME/$2" 2> /dev/null \
                && echo -e "${GREEN}Linked${NC} $1/$2 to ~/$2" \
                || echo -e "${RED}Failed${NC} to link $2"
        
        # Destination Specified
        else

            # If destination folder exists
            if ! [[ -d $3 ]]; then
                >&2 echo "${RED}Error:${NC} [$3] not found in home directory"
            fi

            if [[ -f ~/$3/$2 ]]; then
                mv "$HOME/$3/$2" "$HOME/$3/$2.old"
                echo -e "${LB_BLUE}Moved${NC} ~/$3/$2 to ~/$3/$2.old"
            fi
            ln -s "$HOME/.dotfiles/$1/$2" "$HOME/$3/$2" 2> /dev/null \
                && echo -e "${GREEN}Linked${NC} $1/$2 to ~/$3/$2" \
                || echo -e "${RED}Failed${NC} to link $2${NC}"
        fi

    fi

}

while read LINE; do
    if [[ $LINE != "#"* && $LINE != "^[ ]*$" ]]; then 
        linkFile $LINE
    fi
done < .toLink
