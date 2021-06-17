FROM node:14

WORKDIR /usr/src/

ENV DB_USERNAME=
ENV DB_PASSWORD=
ENV DB_HOST=

# Create non-root group and add a new user to it
RUN groupadd appgroup && useradd -G appgroup appuser

COPY package*.json /usr/src/

RUN npm install

COPY src/ /usr/src/

# Change the user to non-root
USER appuser

EXPOSE 80

CMD ["node", "/usr/src/app.js"]