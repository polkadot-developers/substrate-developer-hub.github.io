# Q: What is this dockerfile for?
# A: https://docusaurus.io/docs/en/docker

FROM node:8.11.4

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./docs /app/docs
COPY ./website /app/website
RUN yarn install

CMD ["yarn", "start"]
