# Use Node.js as the base image
FROM node:16-alpine

WORKDIR /app/api

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY api/package*.json api/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy API source code
COPY api/ .

# Create uploads directory
RUN mkdir -p public/uploads

# Set environment for testing
ENV NODE_ENV=test

EXPOSE 1337

CMD ["yarn", "develop"]