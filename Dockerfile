# Unable to build container using alpine due to compiled node dependenies being built using glibc
# whereas alpine uses musl-libc. See https://stackoverflow.com/a/45987284
FROM node:lts-alpine

RUN apk update

# Install node-gyp dependencies, see https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache --virtual .gyp python make g++

# Set application working directory
WORKDIR /home/node/app

# Place global dependencies in node user directory, see Docker and Node.js Best Practices
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Use yarn for dependency management
RUN npm install -g yarn

# Install app dependencies, separate from source code
COPY package.json /home/node/app
COPY yarn.lock /home/node/app

RUN yarn install

## gyp no longer needed
RUN apk del .gyp

# Copy source code to working directory
COPY . /home/node/app

# Switch from root user
USER node

EXPOSE 80
