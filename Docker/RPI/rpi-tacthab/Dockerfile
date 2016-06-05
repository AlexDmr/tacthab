FROM alexd2/rpi-node-6xx

RUN node --version
RUN git clone https://github.com/AlexDmr/tacthab.git

WORKDIR ./tacthab
RUN npm install
# RUN cd IHM ; gulp

EXPOSE 8888 8443

CMD node main.js
