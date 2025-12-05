FROM node:24-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml /app
RUN pnpm fetch

COPY . /app
RUN pnpm install --offline --frozen-lockfile
RUN pnpm exec playwright install --with-deps chromium --only-shell


ENV NODE_OPTIONS="-r dd-trace/ci/init"
ENV DD_TEST_SESSION_NAME="critical e2e tests"
CMD ["pnpm", "test:critical"]