" disables arrow keys
noremap <UP>    <NOP>
noremap <DOWN>  <NOP>
noremap <LEFT>  <NOP>
noremap <RIGHT> <NOP>
inoremap kj <ESC>

set nocompatible        " ensure config is not used with Vi
set clipboard=unnamed

"Colors"
set t_Co=256            " Goes before colorscheme
colorscheme default
syntax enable           " enables syntax highlighting


"Indentation"
set expandtab           " tabs expand to spaces
set tabstop     =4      " num of visual spaces per tab
set softtabstop =4      " num of spaces per tab in edit
set shiftwidth  =4      " num of spaces to use per indent
set smarttab            " uses shiftwidth for indents instead of tabstop
filetype indent on      " loads filetype specific indentation settings

"UI config"
set number              " enables linenumbers
"set relativenumber      " enables relative linenumbers
set wildmenu            " visual autocomplete for command menu
set showmatch           " highlights matching brackets
set showcmd             " display incomplete commands
"set cursorline          " highlights the cursor line
"set cursorcolumn        " highlights the cursor column
set colorcolumn =80     " colours the 80th column

" displays whitespace as characters
" set list listchars=tab:│\ ,trail:·,nbsp:⎵

"Config"
set nomodeline          " disabled for security reasons     
set autochdir           " sets the working directory to the current file
set virtualedit =block  " allows blockwise selections
"set textwidth   =79     " sets the textwidth formatting to 79 characters (PEP 8)
set lazyredraw          " redraw only when needed
set mouse       =a      " enables mouse in all modes
set wildignorecase      " ignores case on command autocompletion
set formatoptions-=t    " disables formatting for text
au FileType text,markdown setlocal formatoptions+=t "re-enables for text files
filetype plugin on      " loads filetype specific plugin settings
set omnifunc    =syntaxcomplete#Complete
" Ctrl-L will redraw the screen, updating the syntax and de-highlight matches
noremap <silent><c-l> :nohlsearch<cr>
            \:diffupdate<cr>
            \:syntax sync fromstart<cr>
            \<c-l>

execute pathogen#infect()

" Nerd Tree Map
map <C-n> :NERDTreeToggle<CR>
