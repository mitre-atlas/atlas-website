### STAGE 1: Build ###
FROM node:latest as build
RUN mkdir /usr/src/advml.pages.mitre.org
WORKDIR /usr/src/advml.pages.mitre.org
ENV PATH /usr/src/advml.pages.mitre.org/node_modules/.bin:$PATH
COPY package.json /usr/src/advml.pages.mitre.org/
RUN npm install
COPY . ./
RUN npm run generate

FROM nginx:stable-alpine
COPY --from=build /usr/src/advml.pages.mitre.org/dist /usr/share/nginx/html
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["nginx", "-g", "daemon off;"]
