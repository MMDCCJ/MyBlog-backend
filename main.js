const express = require('express');
const mysql = require('mysql')
const body_parser = require('body-parser')
const app = express();
const port = 80;
const { DateFormat } = require('./utils');
const db = mysql.createPool({
    host: "127.0.0.1",
    user: 'root',
    password: '020522', // 上线后改成20020522
    database: 'blog'
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use('/', express.static('./web'))
app.use(body_parser.urlencoded({ extended: false }))
app.all('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader("Access-Control-Allow-Headers", "content-type,curUserId,token,platform");

    next();
})
// 博客slogan
app.get('/api/sayings', (req, res) => {
    const sqlStr = 'SELECT * FROM sayings'
    db.query(sqlStr, (err, result) => {
        if (err) return res.send({
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
// 文章详细页
app.get('/api/article/overview', (req, res) => {
    const page = 5 * (Number(req.query.page) - 1);
    // 从后到前查找所有的文章 一次返回10条数据
    const sql = `SELECT * FROM Article
                WHERE id <= (SELECT MAX(id) FROM Article)-? AND Article.isDelete='N'
                ORDER BY id DESC
                LIMIT 5`
    db.query(sql, [page], (err, result) => {
        if (err) {
            return res.send({
                code: 400,
                data: err
            })
        }
        if (!result) {
            return res.send({
                code: 200,
                msg: 'error'
            })
        }
        if (result?.length === 0) {
            return res.send({
                code: 204,
                msg: "数据库内容缺失或超出范围"
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
// 查询具体文章
app.get('/api/article/content', (req, res) => {
    const id = req.query.id;
    const sql = `SELECT * FROM article_main
                WHERE AID = ?`
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.send({
                code: 400,
                data: err
            })
        }
        if (result.length === 0) {
            return res.send({
                code: 204,
                msg: "为查询到该id文章，请联系管理员"
            })
        }
        return res.send({
            code: 200,
            data: result
        })
    })
})
// 创建文章
app.post('/api/writing', (req, res) => {
    const reqBody = req.body
    const Article_SQL = `INSERT INTO Article(firstUpdateDate,lastUpdateDate,title,articleBody,articleType,isDelete,author) VALUES(?,?,?,?,?,?,?)`
    const Article_Main_SQL = `INSERT INTO Article_Main(AID,article) VALUES(?,?)`
    const date = DateFormat(new Date())
    db.query(Article_SQL, [date, date, reqBody.title, reqBody.articleBody, reqBody.articleType, "N", reqBody.author], (err, result) => {
        if (err) {
            return res.send({
                code: 400,
                data: err
            })
        }
        if (result.affectedRows === 0) {
            return res.send({
                code: 204,
                msg: "未成功添加"
            })
        }
        const AID = result.insertId;
        db.query(Article_Main_SQL, [AID, reqBody.articleMain], (err, result) => {
            if (err) {
                res.send({
                    code: 400,
                    data: err
                })
            }
            if (result.affectedRows === 0) {
                return res.send({
                    code: 204,
                    msg: "文章添加出错请联系管理员"
                })
            }
            return res.send({
                code: 200,
                msg: "添加成功！"
            })
        })
    })

})
// 获取文章的详细信息用于编辑
app.get('/api/writing/updateData', (req, res) => {
    const id = req.query.id;
    const sql = `SELECT
    article_main.article,
    article.title,
    article.articleBody,
    article.articleType,
    article.author
    FROM
    article_main ,
    article
    WHERE article_main.AID = ? AND article.id=article_main.AID
    `
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.send({
                code: 400,
                data: err
            })
        }
        if (result.length === 0) {
            return res.send({
                code: 204,
                msg: "查询失败"
            })
        }
        return res.send({
            code:200,
            data:result
        })
    })
})
// 修改更新文章
app.post('/api/updateArticle', (req, res) => {
    const reqBody = req.body
    console.log(reqBody);
    const date = DateFormat(new Date())
    const UpdateArticleSql = `UPDATE Article SET lastUpdateDate=?,title=?,articleBody=?,articleType=?,author=?
    WHERE ID = ?
    `
    const UpdateArticleMainSql = `UPDATE Article_Main SET article=? WHERE AID=?`
    db.query(UpdateArticleSql, [date, reqBody.title, reqBody.articleBody, reqBody.articleType, reqBody.author, reqBody.id], (err, result) => {
        if (err) {
            return res.send({
                code: 400,
                data: err
            })
        }
        console.log(result);
        if (result.affectedRows === 0) {
            return res.send({
                code: 204,
                msg: "修改失败"
            })
        }
        db.query(UpdateArticleMainSql, [reqBody.article, reqBody.id], (err, result) => {
            if (err) {
                return res.send({
                    code: 400,
                    data: err
                })
            }
            if (result.affectedRows === 0) {
                return res.send({
                    code: 204,
                    msg: "修改失败"
                })
            }
            return res.send({
                code: 200,
                msg: '修改成功'
            })
        })

    })
})
app.get('/welcome', (req, res) => {
    res.send('<p>if you can see this message,that server is running</p><img src="https://img.moegirl.org.cn/common/b/ba/%E6%97%A9%E5%9D%82%E7%88%B1.png"><img>')
})