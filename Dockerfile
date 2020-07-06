# Q: What is this dockerfile for?
# A: https://docusaurus.io/docs/en/docker

FROM node:12.13.0

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./docs /app/docs
COPY ./website /app/website
RUN yarn install

CMD ["yarn", "start"]
