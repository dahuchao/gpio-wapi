FROM resin/rpi-raspbian

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN sudo bash nodesource_setup.sh
RUN sudo apt-get install nodejs
RUN sudo apt-get install build-essential

# Adding source files into container
ADD ./ /app

# Define working directory
WORKDIR /app

# Install app dependencies
RUN npm install

# Open Port 80
EXPOSE 3000

# Run Node.js
CMD ["npm", "start"]