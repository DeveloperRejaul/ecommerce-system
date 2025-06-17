FROM node:20-alpine

WORKDIR /app

COPY /server/package.json /app/

RUN npm install

COPY /server/src /app/src
COPY /server/tsconfig.json /app/
COPY /server/tsconfig.build.json /app/
COPY /server/nest-cli.json /app/
COPY /server/backup.js /app/
COPY /server/google.json /app/



EXPOSE 3001

# production
# RUN npm run build
# COPY ../home  /app/client
# COPY ../dashboard/dist  /app/client
# CMD ["npm", "run","node:dev"] 

# development 
COPY ../home  /app/client
COPY ../dashboard/dist  /app/client
CMD ["npm", "run","dev"]