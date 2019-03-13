FROM node:7
WORKDIR /
COPY package.json /
RUN npm install
CMD  electron . --runapp homepage --nogui true --deleteonexit true
EXPOSE 80
