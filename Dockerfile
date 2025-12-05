FROM public.ecr.aws/docker/library/node:20-alpine as builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY public ./public
COPY src ./src
COPY tsconfig.json vite.config.ts index.html ./

RUN npm run build


FROM public.ecr.aws/nginx/nginx:1.27-alpine

EXPOSE 3000

RUN apk add --no-cache jq

COPY docker/docker-entrypoint.sh /
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

