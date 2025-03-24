require('dotenv').config()

const express = require('express')

const { start } = require('repl');

const app = express()

const port = 3000;

app.get('/', (req,res) =>{
    res.send("hellow world")
})
app.get('/twitter', (req,res) =>{
    res.send("amitrawat")
})

app.listen(process.env.PORT, () => {
    console.log(`connected to server ${port}`)
})