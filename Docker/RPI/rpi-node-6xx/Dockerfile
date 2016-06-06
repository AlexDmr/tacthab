FROM alexd2/rpi-raspbian

# NodeJS stuff
RUN apt-get -y purge node
RUN apt-get -y purge nodejs
RUN sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
RUN apt-get -y install nodejs
RUN npm install -g bower
RUN npm install -g gulp
