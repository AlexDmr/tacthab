FROM alexd2/nodejs.5.xx

RUN node --version
RUN git clone https://github.com/AlexDmr/tacthab.git

WORKDIR ./tacthab
RUN npm install
RUN cd IHM ; bower install --allow-root

EXPOSE 8888 8443

CMD node main.js
