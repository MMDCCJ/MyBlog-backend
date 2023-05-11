const express = require('express');
const mysql = require('mysql')
const app = express();
const port = 80;
const { DateFormat } = require('./utils');
const db = mysql.createPool({
    host: "127.0.0.1",
    user: 'root',
    password: '20020522',
    database: 'blog'
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/', express.static('./web'))
// 博客slogan
app.get('/api/sayings', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*") // 上线后请将这里改成 http://www.mmdccj.xyz
    const sqlStr = 'SELECT * FROM sayings'
    db.query(sqlStr, (err, result) => {
        if (err) res.send({
            code: 400,
            data: err
        })
        if (result.length === 0) {
            return res.send({
                code: 400,
                data: '返回为空，可能是数据库数据丢失'
            })
        } else {
            return res.send({
                code: 200,
                data: result
            })
        }
    })
})
app.get('/api/article/overview', (req, res) => {
    console.log(req.query.page);
    const page = 6 * Number(req.query.page)
    if (!page) {
        return res.send({ code: 400, msg: "错误的参数或缺失参数" });
    }
    const sql = `SELECT * FROM Article
                WHERE id > (SELECT COUNT(id) FROM Article)-? AND id <= (SELECT COUNT(id) FROM Article)-?+6
                ORDER BY id
                LIMIT 6`
    const sql2 =  
    db.query(sql, [page,page], (err, result) => {
        if (err) {
            res.send({
                code: 400,
                data: err
            })
        }
        if (result.length === 0) {
            return res.send({
                code: 204,
                msg: "数据库内容缺失"
            })
        }
        for (let i = 0; i < result.length; i++) {
            result[i]["firstUpdateDate"] = DateFormat(result[i]["firstUpdateDate"])
            result[i]["lastUpdateDate"] = DateFormat(result[i]["lastUpdateDate"])
        }
        return res.send({
            code: 200,
            data: result
        })
    })
})
app.get('/welcome', (req, res) => {
    res.send('<p>if you can see this message,that server is running</p><img src="https://img.moegirl.org.cn/common/b/ba/%E6%97%A9%E5%9D%82%E7%88%B1.png"><img>')
})