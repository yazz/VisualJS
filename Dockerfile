FROM node:10
WORKDIR /home/node/
COPY package.json .
RUN npm install
COPY . .
RUN chown node --recursive .
EXPOSE 3000
USER node
CMD ["node",  "src/electron.js",   "--runapp",   "homepage",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]
