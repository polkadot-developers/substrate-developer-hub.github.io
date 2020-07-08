# Q: What is this dockerfile for?
# A: https://docusaurus.io/docs/en/docker

# Unify with our CI test image node version
FROM node:10.15.2

WORKDIR /app/website

EXPOSE 3000 35729
COPY ./docs /app/docs
COPY ./website /app/website
RUN yarn install

CMD ["yarn", "start"]
