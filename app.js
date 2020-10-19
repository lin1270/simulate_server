const express = require('express')
const bodyParser = require("body-parser")
const apiMgr = require('./apiMgr')

const app = express()
const HOST = 9000

app.use(bodyParser.urlencoded({extended: true})) 

apiMgr.init()

app.use(express.static(__dirname + '/html'));

app.all('*',function(req,res,next){  
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    
    next();
})


apiMgr.data.map((item)=>{
    const methods = ['get','post','put','delete']
    let { method,route } = item
    method = typeof method === 'string' ? method.toLowerCase().trim() : 'get'
    route = typeof route === 'string' ? route.trim() : null
    if( methods.includes(method) && route){
        app[method](route,(req,res) => apiMgr.handleRequest(req,res,item))
    }

})

app.listen(HOST, ()=>{
    console.log('service is running at HOST:' + HOST)
})