# --- build ---------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Config is baked in at build time. Override with --build-arg, or leave the
# defaults in src/config.ts.
ARG VITE_ARRIVES_AT
ARG VITE_MOVES_IN_AT
ARG VITE_WAIT_STARTED_AT
ARG VITE_FROM_CITY
ARG VITE_TO_CITY
ARG VITE_HOME_LABEL
ARG VITE_EYEBROW
ARG VITE_SETTLING_EYEBROW
ARG VITE_MESSAGE
ARG VITE_SETTLING_MESSAGE
ARG VITE_ARRIVED_MESSAGE
ARG VITE_ARRIVAL_STEP
ARG VITE_MOVE_IN_STEP
ARG VITE_LOCALE
ARG VITE_TIME_ZONE

RUN npm run build

# --- serve ---------------------------------------------------------------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
