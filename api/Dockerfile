# Use Node.js as the base image
FROM node:16-alpine

WORKDIR /app/api

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy API source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

RUN node ./script/seed.js 

# Set environment for testing
ENV NODE_ENV=test

EXPOSE 1337

CMD ["yarn", "develop"]
