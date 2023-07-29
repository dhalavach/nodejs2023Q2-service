FROM node:18-alpine3.17 as builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build


FROM node:18-alpine3.17 as runner
WORKDIR /app
COPY package.json /app
COPY --from=builder /app/dist /app
EXPOSE 5000
CMD npm run start && npx prisma generate && npx prisma migrate dev
