// Express(익스프레스) 웹 프레임워크를 사용하여 서버를 만들기.
const express = require("express");
const app = express(); // 서버 애플리케이션을 생성.
const port = 8100; // 서버가 실행될 포트 번호

// 데이터를 해석하기 위한 라이브러리(패키지)들을 불러옵니다.
const bodyParser = require("body-parser"); // 클라이언트(사용자)에서 보낸 데이터를 분석하기 위해 사용
const cookieParser = require("cookie-parser"); // 쿠키를 쉽게 다룰 수 있도록 도와주는 패키지

// User 모델을 불러옵니다. (데이터베이스의 "User" 컬렉션과 연결된 모델)
const { User } = require("./models/User");

// 데이터베이스 접속 정보를 저장한 설정 파일을 불러옵니다.
const config = require("./config/key");

// 📌 클라이언트에서 보낸 데이터를 해석할 수 있도록 설정합니다.
// `application/x-www-form-urlencoded` 방식으로 전송된 데이터를 해석
app.use(bodyParser.urlencoded({ extended: true }));

// JSON 형식으로 전송된 데이터를 해석
app.use(bodyParser.json());

// 쿠키를 사용할 수 있도록 설정
app.use(cookieParser());

// 몽고DB(MongoDB) 데이터베이스 연결
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI) // 데이터베이스 접속 정보(보안상 숨김)
  .then(() => console.log("--------------------MongoDB Connected------------------"))
  .catch((err) => console.log(err));

// 기본 페이지 설정
// 브라우저에서 `http://localhost:8100/` 로 접속하면 "Hello World"라는 문자를 보여줍니다.
app.post("/", (req, res) => {
  res.send("Hello World");
});

// 회원가입 API
app.post("/register", async (req, res) => {
  // 사용자가 입력한 정보를 받아서 회원을 생성하는 기능
  try {
    // 클라이언트에서 받은 요청(req.body) 데이터를 User 모델을 이용해 새 사용자(user)로 생성
    const user = new User(req.body);
    
    // 데이터베이스에 저장
    await user.save();

    // 저장 성공 시, 성공 메시지를 응답으로 보냄
    res.status(200).send({ message: "저장 성공!" });
  } catch (err) {
    // 오류 발생 시, 오류 메시지를 클라이언트에게 응답
    res.status(500).send({ message: "오류 발생", err });
  }
});

// 로그인 API
app.post("/login", async (req, res) => {
  try {
    // 데이터베이스에서 이메일이 일치하는 유저 찾기
    const user = await User.findOne({ email: req.body.email });

    // 사용자가 데이터베이스에 없을 경우
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당되는 유저가 없습니다.",
      });
    }

    // 비밀번호 비교 (사용자가 입력한 비밀번호 와 데이터베이스에 저장된 암호화된 비밀번호)
    const isMatch = await user.comparePassword(req.body.password);

    // 비밀번호가 다를 경우
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
    }

    // 로그인 성공: 사용자에게 고유한 '토큰'을 발급
    const token = await user.generateToken();

    // 생성된 토큰을 쿠키에 저장 (쿠키는 사용자의 브라우저에 저장됨)
    res
      .cookie("x_auth", token) // 'x_auth'라는 이름의 쿠키에 토큰 저장
      .status(200) // 요청 성공 상태 코드(200)를 응답
      .json({ loginSuccess: true, userId: user._id }); // 성공 메시지와 사용자 ID 반환
  } catch (err) {
    // 로그인 중 오류가 발생하면 클라이언트에게 오류 메시지 전송
    res.status(500).send({ message: "로그인 중 오류 발생", err });
  }
});

// 서버 실행
// 서버가 설정한 포트(8100)에서 실행됩니다.
app.listen(port, () => console.log(`서버가 실행 중입니다! 포트 번호: ${port}`));
