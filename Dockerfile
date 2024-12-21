# Use the Node.js 18 image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /var/www/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the development server port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "serve", "--", "--port", "3000"]
