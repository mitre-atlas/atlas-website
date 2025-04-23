# ATLAS Website

ATLAS enables researchers to navigate the landscape of threats to artificial intelligence systems. Visit https://atlas.mitre.org for more information.

This repository contains the ATLAS website source code, which is built upon Vue 3 and served via GitHub Pages at https://atlas.mitre.org.

## Initial Git Setup

This project uses the `atlas-data` project in this group as a Git submodule in `public/atlas-data`.

Clone the repository using `git clone --recurse-submodules`, or if the repository is already cloned, run `git submodule init` then `git submodule update`.

Once the submodule is available, run the following **once** to sparse checkout only the necessary files in the `dist` directory.

```bash
git -C static/atlas-data/ config core.sparseCheckout true
echo 'dist/*' >> .git/modules/static/atlas-data/info/sparse-checkout
git submodule update --force --checkout static/atlas-data/
```

## Updating ATLAS Data

To update `atlas-data`, run `git submodule update --remote` to get the latest from its main branch, then commit the result.

## Development Setup

Ensure node and npm are available - currently using node v20.

```bash
# Install dependencies
$ npm install

# Serve with hot reload
$ npm run dev

# Build for production and launch preview server
$ npm run build
$ npm run preview
```

## Notice

Copyright 2021-2025 The MITRE Corporation.
Approved for Public Release; Distribution Unlimited. Case Number 21-2363.
