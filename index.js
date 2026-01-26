const { createServer } = require("http");
const app = require("./app");
const { Server } = require("socket.io");
require("dotenv");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://chat-web-pi-five.vercel.app",
  },
});

require("./utils/io")(io);
httpServer.listen(process.env.PORT, () => {
  console.log("server listening on port", process.env.PORT);
});
