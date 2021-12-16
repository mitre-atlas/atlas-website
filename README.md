# Adversarial ML Threat Matrix

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Docker Setup/Build
```bash
#setup image for docker website
$ docker build -t atlas:atlas-website .

#run website locally on port 3333 (http://localhost:3333)
$ docker run -d -p 3333:80 atlas:atlas-website

#save website image as tar file
$ docker save -o atlas-website-image.tar atlas:atlas-website

#load website tar file
$ docker load -i atlas-website-image.tar
```

## Tests

Playwright tests are located in the tests directory.

How to test with playwright:

Make sure an instance of ATLAS is running – npm run dev

In another terminal tab, run the tests:
> URL=my-url npx playwright test

Set the environment variable `URL` prior to making the test call with base URL of the instance to be tested.

Examples:

```
> URL=http://localhost:3000 npx playwright test
> URL=https://advml.lt.mitre.org npx playwright test
```


	Writing tests:

For an example of a test, refer to tests/case-study-builder.spec.js
In order to write more effective and robust tests, it is a good idea to ID as many page components as possible during development. This will make writing tests significantly easier, as you can reference specific components by ID. For more complicated components, ID their subcomponents for reference in tests.


For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
