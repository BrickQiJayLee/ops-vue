FROM node:8.12.0

WORKDIR /app/
COPY ./dist/ /app/

# RUN npm install -g http-server
RUN echo "deb http://ftp.cn.debian.org/debian/ stretch main" > /etc/apt/sources.list
RUN echo "deb http://ftp.cn.debian.org/debian/ stretch-updates main" >> /etc/apt/sources.list
RUN echo "deb http://ftp.cn.debian.org/debian-security stretch/updates main" >> /etc/apt/sources.list

RUN apt update

RUN apt install -y nginx

ADD ./nginx.conf/ /etc/nginx/conf.d/

ENTRYPOINT [ "/usr/sbin/nginx", "-g", "daemon off;" ]