FROM dahu.chao/rpi-node

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