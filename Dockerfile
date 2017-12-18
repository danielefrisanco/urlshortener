#FROM mongo:3.2.10

#create DB directory
#RUN mkdir -p /data/db
#EXPOSE 27017

#CMD ["mongod"]

FROM node:4.5.0

WORKDIR /usr/app

COPY package.json .
COPY . /usr/app
RUN npm install --quiet

#CMD ["node", "index.js"]
#RUN npm start
