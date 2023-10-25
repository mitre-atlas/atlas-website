Setup similar to Vue 2 repo--see below

## Prerequisites

We recommend using Visual Studio Code (or VScode, as the cool kids call it) with a remote connection into a Ubuntu-based container. You can set up a container by following [these instructions](https://ai-platform.pages.mitre.org/compute-resources/gpu-server-setup/).

Once you have done this and have a terminal connection to the remote server, you can execute the following instructions:

1. `sudo apt-get install unzip` for Fast Node Manager dependencies
2. To manage node versions, install <https://github.com/Schniz/fnm> and install the LTS via `fnm install --lts`. Currently we are using `v16` (`fnm use v16`), but we are working towards using v20 and newer versions 
3. Check out this project repository, and it defaults to the `main` branch.

## Initial Git Setup

This project uses the `atlas-data` project in this group as a Git submodule in `public/atlas-data`.

Clone the repository using `git clone --recurse-submodules`, or if the repository is already cloned, run `git submodule init` then `git submodule update`.

Once the submodule is available, run the following **once** to sparse checkout only the necessary files in the `dist` directory.

```bash
git -C public/atlas-data/ config core.sparseCheckout true
echo 'dist/*' >> .git/modules/public/atlas-data/info/sparse-checkout
git submodule update --force --checkout public/atlas-data/

```

## Updating ATLAS Data

To update `atlas-data`, run `git submodule update --remote` to get the latest from its main branch, then commit the result.


## Project Setup

```sh
git submodule update --init
npm install

```

### Compile and Hot-Reload for Development

```sh
npm run dev
```