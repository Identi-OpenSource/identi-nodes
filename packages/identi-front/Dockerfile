FROM nginx:1.25

RUN apt-get -y update && apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

WORKDIR /var/front

COPY . .
COPY ./nginx-default.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
