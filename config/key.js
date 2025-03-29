if(process.env.NODE_ENV === 'production') {
  module.exports = require("./prod") // 배포가 되었을 경우
} else {
  module.exports = require("./dev") // 로컬 환경에서
}