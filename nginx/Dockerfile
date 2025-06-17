FROM nginx:1.23-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d

COPY ./ssl/certificate.crt /etc/ssl/certificate.crt
COPY ./ssl/private.key /etc/ssl/private.key

CMD ["nginx", "-g", "daemon off;"]