FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
EXPOSE 8
CMD ["node","Backend/server.js"]
