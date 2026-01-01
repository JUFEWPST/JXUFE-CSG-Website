FROM node:24-bookworm

ARG NUXT_PUBLIC_BUILDER
ARG NUXT_PUBLIC_BUILD_TIME
ARG NUXT_PUBLIC_COMMIT_HASH
ARG NUXT_PUBLIC_COMMIT_HASH_SHORT

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN NUXT_PUBLIC_BUILDER=$NUXT_PUBLIC_BUILDER \
    NUXT_PUBLIC_BUILD_TIME=$NUXT_PUBLIC_BUILD_TIME \
    NUXT_PUBLIC_COMMIT_HASH=$NUXT_PUBLIC_COMMIT_HASH \
    NUXT_PUBLIC_COMMIT_HASH_SHORT=$NUXT_PUBLIC_COMMIT_HASH_SHORT \
    pnpm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
