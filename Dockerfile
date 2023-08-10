FROM node:18-alpine3.17 as builder
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

FROM node:18-alpine3.17 as runner
WORKDIR /app
COPY package.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY doc doc
COPY prisma prisma
COPY src src
COPY --from=builder /app/node_modules/ node_modules
EXPOSE 5000
CMD npx prisma migrate dev && npm run start:dev