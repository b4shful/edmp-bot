FROM node:lts-alpine

RUN apk update

# Install node-gyp dependencies
RUN apk add python make gcc g++

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

# Copy source code to working directory
COPY . /home/node/app

# Switch from root user
USER node

EXPOSE 80
