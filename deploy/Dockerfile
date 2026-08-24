FROM node:24-slim AS builder

ARG NUXT_PUBLIC_BUILD_INFO_BUILDER
ARG NUXT_PUBLIC_BUILD_INFO_BUILD_TIME
ARG NUXT_PUBLIC_BUILD_INFO_COMMIT_HASH

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@11.23.0 && \
    pnpm config set registry https://registry.npmmirror.com

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/root/.local/share/pnpm/store

COPY . .

RUN NUXT_PUBLIC_BUILD_INFO_BUILDER=$NUXT_PUBLIC_BUILD_INFO_BUILDER \
    NUXT_PUBLIC_BUILD_INFO_BUILD_TIME=$NUXT_PUBLIC_BUILD_INFO_BUILD_TIME \
    NUXT_PUBLIC_BUILD_INFO_COMMIT_HASH=$NUXT_PUBLIC_BUILD_INFO_COMMIT_HASH \
    pnpm run build

FROM node:24-slim AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=builder /app/.output .output
RUN chown -R node:node /app

USER node

EXPOSE 3000

# node:slim 无 curl，用 Node 自身探测
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
