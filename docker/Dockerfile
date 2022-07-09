FROM hagb/docker-easyconnect:cli

RUN apt update -y &&\
    apt install -y curl &&\
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - &&\
    apt install -y nodejs nginx

RUN rm -f /etc/nginx/nginx.conf &&\
    mkdir /etc/nginx/http &&\
    mkdir /etc/nginx/stream

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./frontend-build /usr/share/frontend

COPY ./backend-build /usr/share/backend

COPY ./config.json /root/config.json

COPY ./start-service.sh /usr/local/bin/start-service.sh

RUN chmod +x /usr/local/bin/start-service.sh && ln -s /root/config.json /usr/share/backend/config.json 

VOLUME [ "/root/", "/usr/share/backend/", "/usr/share/sangfor/EasyConnect/resources/logs/", "/var/log/nginx/", "/etc/nginx/http/", "/etc/nginx/stream/" ]

CMD ["start-service.sh && start.sh"]