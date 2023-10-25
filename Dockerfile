# An image was made with this Dockerfile with the name "markteetsdev/sudoku-prod"

# When the image created from this Dockerfile run in a docker container, 
# the frontend will be built via webpack by the command "RUN npm run build",
# the server will be run via the ENTRYPOINT, and the frontend will be served
# to localhost:3000 via express.static serving dist/index.html.
# The web-based mongoDB database is connected to automatically via the server.
FROM node:18.13
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["npx", "ts-node", "./src/server/server.ts"]
