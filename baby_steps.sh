#!/bin/bash

# Downloading Dotfiles
git clone git@github.com:jayman888/dotfiles.git ~/.dotfiles
cd ~/.dotfiles && ./symLink.sh

# Downloading Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# Pathogen for Vim
mkdir -p ~/.vim/autoload ~/.vim/bundle
curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim

# Installing Brew for Mac
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Installing Chunkwm
brew tap crisidev/homebrew-chunkwm
brew install --HEAD --with-tmp-logging chunkwm
brew install --HEAD --with-logging  koekeishiya/formulae/skhd

echo "STARTING CHUNK"
brew services start chunkwm
brew services start skhd
