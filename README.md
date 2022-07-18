# ATLAS Website

## Initial Git Setup
This project uses the `atlas-data` project in this GitLab group as a Git submodule in `static/atlas-data`.  

Git clone repo using `git clone --recurse-submodules`, or if the repository is already cloned, run `git submodule init` then `git submodule update`.

Once the submodule is available, run the following **once** to sparse checkout only the necessary files in the `dist` directory.
```bash
git -C static/atlas-data/ config core.sparseCheckout true
echo 'dist/*' >> .git/modules/static/atlas-data/info/sparse-checkout
git submodule update --force --checkout static/atlas-data/
```

## Updating Atlas Data

To update `atlas-data`, run `git submodule update --remote` to get the latest from its main branch, then commit the result.

## Build Setup

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
```

## Docker Setup/Build
```bash
#setup image for docker website
$ docker build -t atlas:atlas-website .

#run website locally on port 3333 (http://localhost:3000)
$ docker run -d -p 3000:3000 atlas:atlas-website

#save website image as tar file
$ docker save -o atlas-website-image.tar atlas:atlas-website

#load website tar file
$ docker load -i atlas-website-image.tar
```

## Tests

Playwright tests are located in the `/tests` directory.

How to test with playwright:

1. Make sure an instance of ATLAS is running – npm run dev

In another terminal tab, run the tests and set the URL:
> URL=my-url npx playwright test

Examples:

```
> URL=http://localhost:3000 npx playwright test
> URL=https://advml.lt.mitre.org npx playwright test
```

Writing tests:

For an example of a test, refer to `tests/case-study-builder.spec.js`
In order to write more effective and robust tests, it is a good idea to ID as many page components as possible during development. This will make writing tests significantly easier, as you can reference specific components by ID. For more complicated components, ID their subcomponents for reference in tests.


For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## User Site Customization

Create a .env file in the root of your project to set certain variables that can alter the website's appearance and data. Below is an example of the variables that can be set by the user:

```
#input a URL to activate the "Navigator" tab which will pull data from a repository to display MITRE ATLAS™ data alongside MITRE ATT&CK® Enterprise tactics and techniques
NAVIGATOR_URL = https://mitre.github.io/atlas-navigator/
```

You can customize the docker version of the website by mounting in your custom version of the .env file with this command:

```
docker run -d -p 3000:3000 -v /<absolute path>/.env:/app/.env atlas:atlas-website
```