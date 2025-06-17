FROM node:20-alpine
WORKDIR /client

COPY /package*.json /client/


RUN npm install --force

COPY /src /client/src
COPY /app.d.ts /client/app.d.ts
COPY /app.json /client/app.json
COPY /global.css /client/global.css
COPY /babel.config.js /client/babel.config.js
COPY /gstyle.tsx /client/gstyle.tsx
COPY /metro.config.js /client/metro.config.js
COPY /nativewind-env.d.ts /client/nativewind-env.d.ts
COPY /tailwind.config.ts /client/tailwind.config.ts
COPY /tsconfig.json /client/tsconfig.json
COPY /types.d.ts /client/types.d.ts


EXPOSE 8081

# Production
RUN npm run build
CMD ["npm", "run","serve"] 
