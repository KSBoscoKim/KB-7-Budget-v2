# 1. Vue 빌드
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. 실행용
FROM nginx:alpine

# node 설치 (json-server용)
RUN apk add --no-cache nodejs npm

# json-server 설치
RUN npm install -g json-server

# nginx 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 프론트 build 결과
COPY --from=builder /app/dist /usr/share/nginx/html

# json 데이터
WORKDIR /app
COPY db.json .

# 실행
CMD sh -c "json-server --watch db.json --port 3000 & nginx -g 'daemon off;'"