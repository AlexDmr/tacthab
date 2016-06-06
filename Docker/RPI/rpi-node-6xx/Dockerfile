FROM alexd2/rpi-raspbian

# NodeJS stuff
RUN apt-get -y purge node
RUN apt-get -y purge nodejs

# RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo bash - && apt-get install -yq nodejs build-essential
RUN wget https://deb.nodesource.com/setup_6.x
RUN chmod 777 setup_6.x
RUN ./setup_6.x
RUN apt-get install -y nodejs

RUN npm install -g bower
RUN npm install -g gulp
