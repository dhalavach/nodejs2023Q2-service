FROM node:18-alpine3.17 as builder
WORKDIR /app
COPY nest-cli.json ./
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --omit=dev

FROM node:18-alpine3.17 as runner
WORKDIR /app
COPY package.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY doc doc
COPY prisma prisma
COPY --from=builder /app/node_modules/ node_modules
EXPOSE 5000
CMD npx prisma generate && npx prisma migrate deploy && npm run start:dev