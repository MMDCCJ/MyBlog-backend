const express = require('express');
const mysql = require('mysql')
const app = express();
const port = 80;

const db = mysql.createPool({
    host:"127.0.0.1",
    user:'root',
    password:'20020522',
    database:'blog'
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/',express.static('./web'))
app.get('/api/sayings',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","http://www.mmdccj.xyz")
    const sqlStr = 'SELECT * FROM sayings'
    db.query(sqlStr,(err,result)=>{
        if(err) res.send({
            code:400,
            data:err
        })
        if(result.length===0){
            return res.send({
                code:400,
                data:'返回为空，可能是数据库数据丢失'
            })
        }else{
            return res.send({
                code:200,
                data:result
            })
        }
    })
})
app.get('/welcome',(req,res)=>{
    res.send('<p>if you can see this message,that server is running</p><img src="https://img.moegirl.org.cn/common/b/ba/%E6%97%A9%E5%9D%82%E7%88%B1.png"><img>')
})