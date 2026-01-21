const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
module.exports = function (io) {
  //io job
  // 연결로그
  io.on("connection", async (socket) => {
    console.log("client is connected", socket.id);
    // 로그인
    socket.on("login", async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        const welcomeMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: "system" },
        };
        io.emit("message", welcomeMessage);
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on("sendMessage", async (message, cb) => {
      try {
        //유저찾기
        const user = await userController.checkUser(socket.id);
        //메세지 저장
        const newMessage = await chatController.saveChat(message, user);
        io.emit("message", newMessage);
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });
    // 해제로그
    socket.on("disconnect", () => {
      console.log("user is disconnected", socket.id);
    });
  });
};
