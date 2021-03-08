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

LABEL io.k8s.description            The Yazz Visual Javascript system
LABEL io.openshift.expose-services  3000:http
LABEL io.openshift.non-scalable     true
LABEL io.openshift.min-memory       1Gi
LABEL io.openshift.min-cpu          4

USER node
CMD ["node",  "src/electron.js",   "--runapp",   "homepage",   "--deleteonexit",   "true",   "--locked",    "false" ,"--showdebug",    "true" ]
