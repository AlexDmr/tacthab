FROM ubuntu

RUN apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade
RUN apt-get -y install curl
# Basic stuff
RUN apt-get update
RUN apt-get install -y make
RUN apt-get install -y gcc
RUN apt-get install -y libxslt-dev libxml2-dev
RUN apt-get install -y libusb-1.0-0-dev libudev-dev
RUN apt-get install -y build-essential
RUN apt-get install -y wget git-core
RUN apt-get install -y python

