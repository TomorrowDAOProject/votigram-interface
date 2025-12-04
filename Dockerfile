
# Use the official Node.js image to build the app
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Pass environment variables during the build process
ARG BUILD_SCRIPT=build:testnet
ARG VITE_HASH

ENV VITE_HASH=${VITE_HASH}

# Build the application and handle non-root
RUN yarn ${BUILD_SCRIPT}

# Use the official nginx image for serving static files
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]