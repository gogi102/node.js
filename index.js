const express = require('express')
const app = express()
const port = 8100

const mongoose = require('mongoose')
mongoose.connect(
  'mongodb+srv://asher:yjs071210@cluster0.lkua0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
).then(()=>console.log('--------------------MongoDB Connected------------------'))
  .catch(err => console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))