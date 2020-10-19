
const fs = require('fs')

const dbRootPath = './data/'


function forEachDir(currentPath,list){
    if(!fs.existsSync(currentPath)){
        console.log('当前目录 “' + currentPath + '” 不存在')
        return
    }
    fs.readdirSync(currentPath).map((fileName)=>{
        let stat = fs.lstatSync(currentPath + fileName)
        if(stat.isDirectory()){
            forEachDir(currentPath+fileName+'/',list)
        }else if(stat.isFile()){
            try{
                let item = JSON.parse(fs.readFileSync(currentPath + fileName,"utf-8"))
                if( Object.prototype.toString.call(item) !== "[object Object]" ){
                    throw new Error()
                }
                list.push(item) 
            }catch(e){
                console.log('导入 “'+ currentPath + fileName + '” 文件内容异常！' )
            }
        }
    })
}

var apiMgr = {
    data : [],
    init() {
        forEachDir(dbRootPath,this.data)
    },

    handleRequest(req, res, config) {
        let validateHasBlod = /^url\((\S+)\)$/g
        let cfgResBody = config.resBody;
        if (Object.prototype.toString.call(cfgResBody) !== "[object String]") {
            cfgResBody = JSON.stringify(cfgResBody)
        }
        let response = {
            status:config.resStatus || 200,
            header:config.resHeader,
            body:cfgResBody
        }
        if(config.branch && req.originalUrl in config.branch){
            let {resStatus,resHeader,resBody} = config.branch[req.originalUrl]

            if (Object.prototype.toString.call(resBody) !== "[object String]") {
                resBody = JSON.stringify(resBody)
            }
            response['status'] = resStatus || response['status']
            response['header'] = resHeader || response['header']
            response['body'] = resBody || response['body']
        }

        let baseHeader = {
            // 'Content-Type':'application/json;charset=utf-8',
        }

        let validateResult = validateHasBlod.exec(response['body'])
        // if(validateResult){
        //     baseHeader = {
        //         'Content-Type':'application/octet-stream', 
        //         "Content-disposition": "attachment; filename=binary.docx"
        //     }
        // }


        response['header'] = response['header'] ? {
            ...baseHeader,
            ...response['header']
        } : baseHeader
       
       
        res.status(response['status'])      
        res.header(response['header']);
        if(validateResult){
            res.sendFile(validateResult[1],{
                root:__dirname + '/static/',
            },(err)=>{
                if(err){
                    console.log('sendFileError:',err)
                }
            })
        }else{
            if(typeof response['body'] !== 'string' || typeof response['body'] instanceof Object){
                response['body'] = String(response['body'])
            }
            res.send(response['body'])
        }
    }
}


module.exports = apiMgr