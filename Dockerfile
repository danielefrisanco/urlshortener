FROM node:4.5.0

WORKDIR /usr/app

COPY package.json .
COPY . /usr/app
RUN npm install --quiet

#CMD ["node", "index.js"]
#RUN npm start
