# Portfolio

Sushant Sonbarse's portfolio: case studies, interactive infrastructure labs and a résumé, presented in a Neovim/terminal visual language.

## Language

**Palette**:
A named set of colours (background, text, accent, syntax colours) that themes the whole site; Blackmoney is the default and Paper is the light one.
_Avoid_: Theme (except in the `:theme` command and `next-themes` API), colour scheme, skin

**Tone**:
Whether a palette is light or dark; decides `color-scheme` and the dark-only rules.
_Avoid_: Mode, dark mode

**Terminal hero**:
The first viewport of the homepage, where prompt lines (`whoami`, `cat statement.txt`, `ls ~/work`) introduce Sushant and the selected work.
_Avoid_: Intro, splash, masthead

**Fetch panel**:
The neofetch-style box in the terminal hero holding the portrait, short facts and the palette swatches.
_Avoid_: Profile card, sidebar

**Buffer**:
A homepage section below the terminal hero, framed as an open file with a path bar (`work/`, `about.md`, `git log --career`, `lab/`, `contact.sh`).
_Avoid_: Panel, card, block

**Path bar**:
The single mono line above a buffer or page title showing its file path, such as `~/work/crm-on-eks.md`.
_Avoid_: Breadcrumb, winbar

**Status line**:
The Vim-style strip with a mode block (`NORMAL`), the current path and key hints; it closes the terminal hero and forms the footer.
_Avoid_: Footer bar, statusbar

**Command line**:
The `:` prompt (the existing finder dialog) that accepts navigation and `:theme <palette>` commands.
_Avoid_: Command palette, search modal

**Studio**:
The optional cinematic route at `/lab/studio` with the procedural rack, release path, recovery film and fault exercise.
_Avoid_: Flagship, cinema page
