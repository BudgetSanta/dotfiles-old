#!/bin/bash
#Colours for Echos L=Light, D=Dark, B=Bold
NC='\033[0m' # No Color
GREEN='\033[0;32m'
RED='\033[0;31m'
LB_BLUE='\033[1;94m'

linkFile() {
    if [[ $# -eq 3 ]]; then             # Dest Specified
        ln -s ~/.dotfiles/$1/$2 ~/$3/$2 2> /dev/null \
            && echo -e "${GREEN}Linked${NC} $1/$2 to ~/$3/$2" \
            || echo -e "${RED}Failed${NC} to link $2${NC}"
    elif [[ $# -eq 2 ]]; then           # Only folder and file specified
        ln -s ~/.dotfiles/$1/$2 ~/$2 2> /dev/null \
            && echo -e "${GREEN}Linked${NC} $1/$2 to ~/$2" \
            || echo -e "${RED}Failed${NC} to link $2"
    else
        echo -e "${RED}Invalid${NC} line in .toLink: \"$@\""
        echo -e "${LB_BLUE}Correct${NC} to: DOTFILES_FOLDER FILE [DEST_FOLDER]"
    fi
}

while read LINE; do
    linkFile $LINE
done < .toLink
