

# --------------> The build image
FROM node:14.21.1-bullseye-slim AS builder
RUN apt-get update && apt-get install -y \
curl
RUN curl -sSLo /usr/local/bin/dumb-init \
  https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT_VERSION}/dumb-init_${DUMB_INIT_VERSION}_amd64 && \
  chmod +x /usr/local/bin/dumb-init

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ARG NPM_TOKEN
WORKDIR /auth
COPY package*.json /auth/
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
   npm ci --only=production && \
   rm -f .npmrc
 
# --------------> The production image
# FROM node:16.17.0-bullseye-slim

FROM node:14.21.1-bullseye-slim
ENV NODE_ENV production
WORKDIR /auth
COPY --from=builder /usr/local/bin/dumb-init /usr/local/bin/dumb-init
USER node
COPY --chown=node:node --from=builder /user/node_modules /user/src/app/node_modules
COPY --chown=node:node . /user
CMD ["dumb_init", "node","--optimize_for_size", "--max_old_space_size=480", "--gc_interval=100",  "server.js"]