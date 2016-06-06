FROM alexd2/rpi-raspbian

# NodeJS stuff
RUN sudo apt-get -y purge node
RUN sudo apt-get -y purge nodejs
RUN sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo bash - && apt-get install -yq nodejs build-essential
RUN sudo npm install -g bower
RUN sudo npm install -g gulp
