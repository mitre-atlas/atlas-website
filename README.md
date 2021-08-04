# Adversarial ML Threat Matrix

## Git Setup
This project uses the `data` project in this GitLab group as a Git submodule in `content/threat-matrix`.  Clone using `git clone --recurse-submodules`, or if the repository is already cloned, run `git submodule init` then `git submodule update`.

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

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
