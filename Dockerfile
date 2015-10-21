FROM node:4-onbuild

# App
ADD . /src

# Install app dependencies
RUN cd /src; npm install

EXPOSE  80
CMD ["node", "/src/server.js"]