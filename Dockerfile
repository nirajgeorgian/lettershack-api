FROM ubuntu:16.04

# Update the container, Install Build Tools, Install Curl
RUN apt-get update && apt-get install -y build-essential && apt-get install -y curl

# Install Nodejs
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Install Node for Backend
WORKDIR /lettershack/server

RUN npm install -g nodemon
RUN npm install -g babel-cli

# Install the dependencies because node_modules folder change and we don't want to execute npm install every time
COPY ./package*.json ./
RUN npm install

# Now Copy entire folder
COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
