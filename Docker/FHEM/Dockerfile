FROM alexd2/ubuntu

# Install perl packages
RUN apt-get -y --force-yes install libalgorithm-merge-perl \
libclass-isa-perl \
libcommon-sense-perl \
libdpkg-perl \
liberror-perl \
libfile-copy-recursive-perl \
libfile-fcntllock-perl \
libio-socket-ip-perl \
libjson-perl \
libjson-xs-perl \
libmail-sendmail-perl \
libsocket-perl \
libswitch-perl \
libsys-hostname-long-perl \
libterm-readkey-perl \
libterm-readline-perl-perl \
libdevice-serialport-perl \
libio-socket-ssl-perl \
libwww-perl \
GPUtils \
usbutils


# WebSocket
RUN cpan App::cpanminus
RUN cpanm Protocol::WebSocket
RUN cpanm JSON


# INSTALL FHEM
# RUN wget http://fhem.de/fhem-5.7.tar.gz
# RUN cd opt ; tar xvf ../fhem-5.7.tar.gz && mv fhem-5.7 fhem 


# WebSockets stuff
# RUN wget -P /opt/fhem/FHEM/ http://iihm.imag.fr/demeure/FHEM/00_websocket.pm
# RUN wget -P /opt/fhem/FHEM/ http://iihm.imag.fr/demeure/FHEM/10_websocket_fhem.pm
# RUN wget -P /opt/fhem/FHEM/ http://iihm.imag.fr/demeure/FHEM/10_websocket_json.pm


# Data
VOLUME ["/opt/fhem"]


# Ports
EXPOSE 7072
EXPOSE 8083
EXPOSE 8085
EXPOSE 8880

# Command to be executed,a launch fhem...
COPY startFHEM.sh /startFHEM.sh
RUN chmod 755 /startFHEM.sh

# CMD ["/bin/bash", "/startFHEM.sh"]
# CMD ["/startFHEM.sh"]
