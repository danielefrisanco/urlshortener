FROM node
EXPOSE 8080
COPY . /app
WORKDIR /app

RUN cd /app; npm install
CMD ["node", "index.js"]



