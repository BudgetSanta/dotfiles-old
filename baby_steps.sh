#!/bin/bash

# Setting up SSH Keys
mkdir -p ~/.ssh
pushd ~/.ssh
#touch github_rsa cse_rsa bitbucket_rsa
#chmod 400 *_rsa
#touch github_rsa.pub cse_rsa.pub bitbucket_rsa.pub
#touch 644 *_rsa.pub
echo "[ACTION]: Open a new terminal and fill ~/.ssh/*_rsa keys from dashlane"
printf 'Enter anything to continue script?... '
read -r break
popd
echo "[ACTION]: Authorise adding key to CSE machines!"
#ssh-copy-id -i ~/.ssh/cse_rsa.pub z5153405@wagner.cse.unsw.edu.au

# Downloading Dotfiles
echo "[DOWNLOAD]: Personal Dotfiles from github"
git clone git@github.com:jayman888/dotfiles.git ~/.dotfiles
echo " - Symlinking"
pushd ~/.dotfiles
./symLink.sh
popd

# Pathogen for Vim
echo "[DOWNLOAD]: Pathogen for Vim"
mkdir -p ~/.vim/autoload ~/.vim/bundle
curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim
# Vim Undo dir
mkdir -p ~/.vim/undo-dir

# Installing Brew for Mac
echo "[DOWNLOAD]: Brew for Mac/Linux"
# - Flimsy check if mac
if -d /Applications; then
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    mkdir -p ~/Screenshots && defaults write com.apple.screencapture location ~/Screenshots
else
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
fi

# Installing python3
brew install python3

# Installing Chunkwm
brew tap crisidev/homebrew-chunkwm
brew install --HEAD --with-tmp-logging chunkwm
brew install --HEAD --with-logging  koekeishiya/formulae/skhd

#echo "STARTING CHUNK"
brew services start chunkwm
brew services start skhd

# Macapps.link
# - Chrome, Alfred, iTerm
curl -s 'https://macapps.link/en/chrome-alfred-iterm' | sh

# Downloading Oh My Zsh (Should be run LAST, opens zsh prompt halting everything else)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

