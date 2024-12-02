# Use Node.js as the base image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy package.json, package-lock.json, and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application code
COPY . .

# Build the project (if necessary)
RUN yarn build

# Expose the port the API runs on
EXPOSE 1337

# Command to run the API application
CMD ["yarn", "start"]
