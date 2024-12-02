# Use Node.js 16 as the base image
FROM node:16

# Set working directory
WORKDIR /app

# Create API and client directories
RUN mkdir api client

# Copy API package files
COPY api/package*.json api/yarn.lock ./api/

# Copy client package files
COPY client/package*.json client/yarn.lock ./client/

# Install API dependencies
WORKDIR /app/api
RUN yarn install

# Install client dependencies
WORKDIR /app/client
RUN yarn install

# Copy API and client source code
WORKDIR /app
COPY api ./api
COPY client ./client

# Build both applications
WORKDIR /app/api
RUN yarn build

WORKDIR /app/client
RUN yarn build

# Expose ports for both services
EXPOSE 1337 3000

# Create start script
COPY <<EOF /app/start.sh
#!/bin/bash
cd /app/api && yarn start &
cd /app/client && yarn start
EOF

RUN chmod +x /app/start.sh

# Set working directory back to root
WORKDIR /app

# Start both services
CMD ["/app/start.sh"]