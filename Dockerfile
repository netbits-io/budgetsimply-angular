FROM    centos:latest

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js and npm
RUN     yum install -y npm

# App
ADD . /src

# Install app dependencies
RUN cd /src; npm install

EXPOSE  80
CMD ["node", "/src/server.js"]