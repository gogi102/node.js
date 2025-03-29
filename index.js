const express = require("express")
const app = express()
const port = 8100
const bodyParser = require("body-parser")
const {User} = require("./models/User")
const config = require("./config/key")

// application/x-www-form-urlencoded 이런 형태를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({extended: true}))

// json 파일을 분석해서 가져올 수 있게
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(
   config.mongoURI// 몽고DB URL 숨기기
).then(()=>console.log('--------------------MongoDB Connected------------------'))
  .catch(err => console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/register', async(req, res) => {
  // 회원 가입 할떄 필요한 정보들을 클라이언트에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
      try {
        const user = new User(req.body);
        await user.save(); // await을 사용하여 비동기 저장
        res.status(200).send({ message: '저장 성공!'}); // 성공시에 user정보를 json으로 출력
    } catch (err) {
        res.status(500).send({ message: '오류 발생', err }); // 오류 발생시에 err코드 출력
    }
  
})

app.post('/login', (req, res)=> {

  // 요청된 이메일을 데이터베이스에 있는지 찾는다
  User.findOne({email:req.body.email}, (err, userInfo) => {
    if(!userInfo){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당되는 유저가 없습니다다"
      })
    }

    // 요청한 이메일이 존재한다면 비밀번호가 같은지 확인한다
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다"})

      // 비밀번호까지 같다면 토큰 생성성
      user.generateToken((err, user) => {
        
      })
    })
  })
 
  
}) 
app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))