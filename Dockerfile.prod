# Step 1: Build the React app
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy built assets from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the env template for runtime configuration
COPY ./public/env.template /usr/share/nginx/html/env.template

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP
EXPOSE 80

# Copy the start script
COPY start.sh /usr/local/bin/start.sh

# Make the start script executable
RUN chmod +x /usr/local/bin/start.sh

# Set the entrypoint to the start script
ENTRYPOINT ["/usr/local/bin/start.sh"]