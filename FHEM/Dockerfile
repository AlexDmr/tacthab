FROM alexd2/nodejs.5.xx

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
libterm-readline-perl-perl


# WebSocket
RUN cpan App::cpanminus
RUN cpanm Protocol::WebSocket
RUN cpanm JSON


# INSTALL FHEM
RUN wget http://fhem.de/fhem-5.7.tar.gz
RUN cd opt ; tar xvf ../fhem-5.7.tar.gz


# Data
RUN chown fhem /opt/fhem/fhem.cfg
VOLUME ["/opt/fhem"]


# Ports
EXPOSE 8083
EXPOSE 51826


COPY start.sh ./
RUN chmod +x ./start.sh
CMD ["./start.sh"]
