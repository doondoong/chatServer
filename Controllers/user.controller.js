const User = require("../models/user");
const { sha256HashPassword } = require("../utils/password");

const userController = {};

userController.saveUser = async (userName, sid) => {
  // 이미 있는 유저인지 확인
  let user = await User.findOne({ name: userName });
  // 없다면 새로 만들기
  if (!user) {
    user = new User({
      name: userName,
      token: sid,
      online: true,
    });
  }
  // 있는 유저라면 토큰값,접속여부만 갱신
  user.token = sid;
  user.online = true;
  await user.save();
  return user;
};

userController.checkUser = async (sid) => {
  const user = await User.findOne({ token: sid });
  if (!user) throw new Error("user not found");
  return user;
};

userController.loginUser = async (userName, password, socketId) => {
  // 1. 유저 조회
  const user = await User.findOne({ userName });
  if (!user) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  // 2. 입력 비밀번호 해시 재생성
  const pepper = process.env.PASSWORD_PEPPER || "";
  const hashedInputPassword = sha256HashPassword(
    password,
    user.passwordSalt,
    pepper,
  );

  // 3. 해시 비교
  if (hashedInputPassword !== user.passwordHash) {
    throw new Error("비밀번호가 올바르지 않습니다.");
  }

  // 4. 소켓 연결 정보 저장 (기존 로직)
  user.socketId = socketId;
  user.token = socketId;
  user.online = true;
  await user.save();

  return user;
};

userController.loginOut = async (socketId) => {
  // 1. 유저 조회
  const user = await User.findOne({ token: socketId });
  if (!user) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  // 2.로그아웃 처리
  user.online = false;
  await user.save();

  return user;
};
module.exports = userController;
