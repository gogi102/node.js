const mongoose = require('mongoose')
const bycrpt = require('bcrypt')
const saltRounds = 10

const userSchema = mongoose.Schema({

  name: {
    type: String,
    maxlength: 50
  },

  email: {
    type: String,
    trim: true, // 공백 제거 역할
    unique: 1
  },

  password: {
    type: String,
    minlegth: 5
  },

  lastname: {
    type: String,
    maxlength: 50
  },

  role: {
    type: Number,
    default: 0
  },

  image: String,
  
  token: {
    type: String
  },

  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next){
  var user = this

// 비밀번호 변경시에만 암호화 진행행
if(user.isModified('password')){

 // 비밀번호를 암호화
 bycrpt.genSalt(saltRounds, function(err, salt){
    if(err) return next(err)

      bycrpt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash // 유저 비밀번호를 암호화된 비밀번호로 바꿈
        next()
      })
    })  
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

  //plainPassword: 1234567, 암호화된 비밀번호: "$2B%210%12312321" 다시 복호화는 불가능함 ㅠ
  bycrpt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err),
      cb(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}