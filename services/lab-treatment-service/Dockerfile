# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Make port 3000 available to the outside of the Docker container
EXPOSE 3003

# Run the application when the Docker container launches
CMD [ "node", "index.js" ]