# Use Node.js as the base image
FROM node:16-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

WORKDIR /app/api

# Copy package files
COPY api/package*.json api/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy API source code
COPY api/ .

# Build Strapi
RUN yarn build

EXPOSE 1337

CMD ["yarn", "develop"]