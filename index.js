const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log('server je startovan');
});

const db = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bdb246875f1b56',
    password: '90812b3b',
    database: 'heroku_ca5aabe341b095e'
});

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('povezan je sa bazom');
});

app.get('/selectVrstePrihoda', (req,res)=>{
    let sql = 'SELECT * FROM vrste_prihoda';
    let query = db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
