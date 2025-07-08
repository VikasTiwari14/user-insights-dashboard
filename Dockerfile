FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN npm install

# Run tests
CMD ["npm", "test"]
