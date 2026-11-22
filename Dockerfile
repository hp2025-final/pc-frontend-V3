# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Coolify: enable Docker BuildKit secrets and make these variables available
# at build time AND runtime. NEXT_PUBLIC_META_PIXEL_ID is optional.
# No credentials are accepted as Docker ARG/ENV values.
# Coolify supplies this hash so changed build secrets invalidate cached output.
ARG COOLIFY_BUILD_SECRETS_HASH
RUN --mount=type=secret,id=WOOCOMMERCE_BASE_URL,env=WOOCOMMERCE_BASE_URL,required=true \
    --mount=type=secret,id=WOOCOMMERCE_CONSUMER_KEY,env=WOOCOMMERCE_CONSUMER_KEY,required=true \
    --mount=type=secret,id=WOOCOMMERCE_CONSUMER_SECRET,env=WOOCOMMERCE_CONSUMER_SECRET,required=true \
    --mount=type=secret,id=NEXT_PUBLIC_SITE_URL,env=NEXT_PUBLIC_SITE_URL,required=true \
    --mount=type=secret,id=NEXT_PUBLIC_WA_NUMBER,env=NEXT_PUBLIC_WA_NUMBER,required=true \
    --mount=type=secret,id=NEXT_PUBLIC_META_PIXEL_ID,env=NEXT_PUBLIC_META_PIXEL_ID \
    npm run build \
    && rm -rf .next/cache .next/standalone/.next/cache
# Fetch-cache files can contain authenticated WooCommerce URLs; omit them.

FROM base AS runner
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# ISR writes to .next at runtime. Keep that directory writable by the app user.
USER node
RUN mkdir -p .next/cache

EXPOSE 3000
# An empty search returns locally without querying WooCommerce.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('node:http').get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/api/search'},r=>{r.resume();process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1)).setTimeout(4000,()=>process.exit(1))"

CMD ["node", "server.js"]
