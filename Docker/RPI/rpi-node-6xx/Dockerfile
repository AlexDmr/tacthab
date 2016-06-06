FROM alexd2/rpi-raspbian

# NodeJS stuff
RUN apt-get -y purge node
RUN apt-get -y purge nodejs

# RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo bash - && apt-get install -yq nodejs build-essential
RUN wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
RUN dpkg -i node_latest_armhf.deb

RUN npm install -g bower
RUN npm install -g gulp
