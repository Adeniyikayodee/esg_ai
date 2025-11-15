FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Skip build for now - dev mode handles TypeScript
EXPOSE 8000

CMD ["npm", "run", "dev"]