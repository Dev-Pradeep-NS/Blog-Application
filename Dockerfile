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

# Expose port 80 for HTTP
EXPOSE 80

# Use the default Nginx command to start the server
CMD ["nginx", "-g", "daemon off;"]
