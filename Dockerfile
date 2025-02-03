# Step 1: Use an official Node.js image as a base image
FROM node:18 AS build

# Install Yarn globally
#RUN npm i yarn

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
# Copy package.json and yarn.lock files
# COPY package*.json ./
COPY package.json yarn.lock ./
# Step 4: Copy the local package into the container
COPY src/libs src/libs

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the React app for production
RUN yarn build

# Step 7: Use a lightweight web server to serve the static files
FROM nginx:alpine

# Step 8: Copy the build output from the previous stage to the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
