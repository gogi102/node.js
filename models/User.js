const mongoose = require('mongoose')

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

const User = mongoose.model('User', userSchema)

module.exports = {User}