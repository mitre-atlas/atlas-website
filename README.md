# ATLAS Website

ATLAS enables researchers to navigate the landscape of threats to artificial intelligence and machine learning systems. Visit https://atlas.mitre.org for more information.

This repository contains the ATLAS website source code, which is built upon Nuxt.js and its static files served via Pages at https://atlas.mitre.org.

## Initial Git Setup

This project uses the `atlas-data` project in this group as a Git submodule in `static/atlas-data`.

Clone the repository using `git clone --recurse-submodules`, or if the repository is already cloned, run `git submodule init` then `git submodule update`.

Once the submodule is available, run the following **once** to sparse checkout only the necessary files in the `dist` directory.

```bash
git -C static/atlas-data/ config core.sparseCheckout true
echo 'dist/*' >> .git/modules/static/atlas-data/info/sparse-checkout
git submodule update --force --checkout static/atlas-data/
```

## Updating ATLAS Data

To update `atlas-data`, run `git submodule update --remote` to get the latest from its main branch, then commit the result.

## Build Setup

Ensure node and npm are available - currently using LTS v16.

```bash
# install dependencies
$ npm install

# generate static project
$ npm run generate

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# Install documentation dependencies
$ npm run install-docs
# Generate documentation
$ npm run docs:generate-md
# Run documentation dev server
$ npm run docs:dev
```

## Docker Setup

A `Dockerfile` exists in this directory for a development version of the website.

```bash
# Build and run the image
$ docker build -t atlas:atlas-website .
$ docker run -d -p 3000:3000 atlas:atlas-website

# Saving and loading the image
$ docker save -o atlas-website-image.tar atlas:atlas-website
$ docker load -i atlas-website-image.tar
```

## Tests

Playwright tests are located in the `/tests` directory.

### Setup

Run `npx playwright install` to install the playwright test browsers.

### Running tests

1. Make sure an instance of ATLAS is running – npm run dev

2. In another terminal tab, run the tests and set the URL.

If you are on Linux or Mac, for example:

```
URL=http://localhost:3000 npx playwright test
```

If you are on Windows, go to playwright.config.js and update the baseURL:

`baseURL: process.env.URL || 'your_instance_url',`

Then run:

```
npx playwright test
```

### Writing tests

For an example of a test, refer to `tests/case-study-builder.spec.js`
In order to write more effective and robust tests, it is a good idea to ID as many page components as possible during development. This will make writing tests significantly easier, as you can reference specific components by ID. For more complicated components, ID their subcomponents for reference in tests.

## User Site Customization

See `.env.readme` for a set of optional environment variables for website customization. Create a new file called `.env` to specify the variables.
