FROM us.icr.io/image-base/node:14.15-alpine

WORKDIR /usr/src/app

RUN npm install serve -g

# Install app dependencies
#COPY package*.json ./

#RUN npm install
COPY . .
#RUN npm run build
#RUN ls -l
#COPY ./build .

EXPOSE 3000
CMD ["/bin/sh", "/usr/src/app/docker_run.sh"]