# FROM alexd2/rpi-node-6xx
FROM hypriot/rpi-node

RUN node --version
RUN git config --global http.sslVerify false
RUN git clone https://github.com/AlexDmr/tacthab.git

WORKDIR ./tacthab
RUN npm install
# RUN cd IHM ; gulp

EXPOSE 8888 8443

CMD node main.js
