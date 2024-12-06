# Use Node.js as the base image
FROM node:16-alpine

WORKDIR /app/client

# Copy package files  
COPY package.json .

# Install dependencies
RUN yarn install

# Copy client source code
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
