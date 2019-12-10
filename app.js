const express = require('express')
const bodyParser = require("body-parser")
const apiMgr = require('./apiMgr')

const app = express()
const HOST = 8001

app.use(bodyParser.urlencoded({extended: true})) 

apiMgr.init()


app.all('*',function(req,res,next){  
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    
    next();
})

app.post('/apitester/api/createApi', (req,res)=>{
    apiMgr.handleCreate(req, res)
})

app.all('/apitester/api/api/:apiName', (req,res)=>{
    apiMgr.handleRequest(req, res)
})

app.listen(HOST, ()=>{
    console.log('service is running at HOST:' + HOST)
})