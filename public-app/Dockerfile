FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .
COPY public ./public

# Create data directory
RUN mkdir -p /data

EXPOSE 8000

CMD ["npm", "start"]
