FROM node:21-slim
WORKDIR /react-app 
COPY package.json . 
RUN npm install
COPY src/ .
COPY . . 
RUN npm install -g live-server 
RUN npm run build 
EXPOSE 8080
CMD ["live-server", "dist"]