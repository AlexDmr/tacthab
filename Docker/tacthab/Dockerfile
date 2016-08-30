FROM alexd2/node-4xx

RUN node --version
RUN git clone https://github.com/AlexDmr/tacthab.git

WORKDIR ./tacthab
RUN npm install
# RUN cd IHM ; gulp

EXPOSE 8888 8443 6767 1900

CMD node main.js BLE:1
