# Copies in files and installs dependencies
FROM node:lts as install

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# ARG navigator_url

# Escape the URL, then replace the $NAVIGATOR_URL environment variable in
# nuxt.config.js with the provided URL
# RUN export escaped_url=$(echo ${navigator_url} | sed 's/\//\\\//g'); sed -i 's/\$NAVIGATOR_URL/'${escaped_url}'/g' ./nuxt.config.js

# Runs the development server
FROM install as dev
EXPOSE 3000
ENV HOST 0.0.0.0
CMD ["npm", "run", "dev"]
