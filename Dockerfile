FROM node:22-alpine

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY index.js .

CMD ["node", "index.js"]
