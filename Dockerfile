FROM node:7
WORKDIR /
COPY package.json /
RUN npm install
COPY . /
EXPOSE 80
CMD ["node",  "src/electron.js",   "--runapp",   "homepage",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]
