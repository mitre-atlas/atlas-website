# Copies in files and installs dependencies
FROM node:lts as install

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Runs the development server
FROM install as dev
EXPOSE 3000
ENV HOST 0.0.0.0
CMD ["npm", "run", "dev"]
