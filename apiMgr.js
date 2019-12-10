
const fs = require('fs')

let g_data = []
const filePath = './data/api.json'

function g_getItem(name, method) {
    return g_data.find((item)=>{
        return item.name === name && item.method === method
    })
}

function g_addItem(item) {
    let foundItem = g_getItem(item.name, item.method)
    if (!foundItem) {
        g_data.push(item)
    } else {
        for(let key in item) {
            foundItem[key] = item[key]
        }
    }
    
    fs.writeFile(filePath, JSON.stringify(g_data), (e)=>{
        if (e) {
            console.log('...save api error')
        } else {
            console.log('...save api successfully.')
        }
    })
}

var apiMgr = {
    init() {
        try {
            const stream = String(fs.readFileSync(filePath))
            if (stream) {
                try {
                    g_data = JSON.parse(stream)
                } catch(e) {
                    g_data = []
                    console.log('...read api error')
                }
            }
        } catch(e) {
            console.log('...read api error')
        }        
    },

    handleCreate(req, res) {
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        const resJson = {
            success: true,
            msg: ''
        }

        const query = req.body
        if (!query.name || !query.method || !query.type) {
            resJson.success = false
            resJson.msg = '[name,method,type] cannot be empty.'
        }
        
        switch (req.type) {
            case 'json':
                if (!query.data) {
                    resJson.success = false
                    resJson.msg += 'json msg cannot be empty.'
                }
                break
            case 'binary':
                break

        }


        if (resJson.success) {
            resJson.msg = 'create api successfully'

            const item = {
                name: query.name,
                method: query.method,
                type: query.type,
                data: query.data || ''
            }
            console.log('...add api:', item)

            g_addItem(item)
        }

        
        res.end(JSON.stringify(resJson))
    },

    handleRequest(req, res) {
        const apiItem = g_getItem(req.params.apiName, req.method)

        if (apiItem) {
            if (apiItem.type === 'json') {
                res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});                
                res.end(apiItem.data)
            } else if (apiItem.type === 'binary') {
                res.writeHead(200,{'Content-Type':'application/octet-stream', "Content-disposition": "attachment; filename=binary.docx"});
                const src = fs.createReadStream('./static/binary.docx');
                src.pipe(res);
            }
        } else {
            const resJson = {
                success: false,
                msg: 'cannot find api:' + req.params.apiName + ' method:' + req.method
            }
            res.writeHead(404,{'Content-Type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(resJson))
        }
    },
}


module.exports = apiMgr