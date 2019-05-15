FROM node:10
WORKDIR /home/node/
COPY package.json .
RUN npm install
RUN adduser node root
COPY . .
RUN chown node --recursive .
RUN chmod -R 775 /home/node
RUN chown -R node:root /home/node

EXPOSE 3000
USER node
CMD ["node",  "src/electron.js",   "--runapp",   "homepage",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]
