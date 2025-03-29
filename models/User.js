const mongoose = require("mongoose"); // MongoDB와 연결하는 Mongoose 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호를 암호화하는 라이브러리
const saltRounds = 10; // 비밀번호 암호화 강도 설정 (높을수록 보안이 강하지만 속도가 느려짐)
const jwt = require("jsonwebtoken"); // 로그인 후 사용자 인증을 위한 JSON Web Token(JWT) 라이브러리

// "사용자(User)" 데이터 모델 정의
const userSchema = mongoose.Schema({
  name: {
    type: String, // 문자열
    maxlength: 50, // 최대 길이 50
  },
  email: {
    type: String,
    trim: true, // 입력된 이메일의 앞뒤 공백 제거
    unique: 1, // 중복 방지 (같은 이메일이 데이터베이스에 존재하면 안 됨)
  },
  password: {
    type: String,
    minlength: 5, // 비밀번호는 최소 5글자 이상
  },
  lastname: {
    type: String,
    maxlength: 50, // 성(lastname)도 최대 길이 50
  },
  role: {
    type: Number, // 숫자 타입 (0: 일반 사용자, 1: 관리자 등)
    default: 0, // 기본값 0 (일반 사용자)
  },
  image: String, // 프로필 이미지 (URL 형태로 저장 가능)
  token: {
    type: String, // 로그인 성공 시 발급되는 인증 토큰
  },
  tokenExp: {
    type: Number, // 토큰 만료 시간 (선택 사항)
  },
});

// 비밀번호 저장 전에 암호화 처리
userSchema.pre("save", async function (next) {
  let user = this;

  // 비밀번호가 새로 입력되거나 변경될 때만 실행
  if (user.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    next();
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// 토큰 생성 메서드
userSchema.methods.generateToken = async function () {
  try {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), "token!");
    user.token = token;
    await user.save();
    return token;
  } catch (err) {
    throw err;
  }
};

// "User" 모델을 생성 (MongoDB의 'users' 컬렉션과 연결됨)
const User = mongoose.model("User", userSchema);

// 외부에서 "User" 모델을 사용할 수 있도록 내보내기 (export)
module.exports = { User };
