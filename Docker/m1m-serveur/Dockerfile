FROM alexd2/tacthab

RUN rm -r IHM
# RUN sudo ifconfig lo multicast
# RUN sudo route add -net 224.0.0.0 netmask 240.0.0.0 dev lo

VOLUME ["/tacthab/client"]
EXPOSE 8888 8443 6767 1900/udp

CMD node main.js
