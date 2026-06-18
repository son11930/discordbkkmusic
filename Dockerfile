FROM node:20-alpine

# Install dependencies required for ffmpeg and native modules
RUN apk add --no-cache python3 make g++ ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Start the bot
CMD ["npm", "run", "start"]
