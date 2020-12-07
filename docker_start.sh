#!/bin/sh
# chmode -R 777 ~/.config && chmode -R 777 ~/.cache
cd /usr/app;
npm install && \
  ./node_modules/.bin/knex migrate:up --esm && \
  npm run build.ts && \
  npm run start