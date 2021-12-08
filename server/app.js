const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
//var privateKey  = fs.readFileSync(path.resolve('server/key.pem', 'utf8'));
// var privateKey  = fs.readFileSync('server/key.pem', 'utf8');
// var certificate = fs.readFileSync('server/cert.pem', 'utf8');
var privateKey  = fs.readFileSync(__dirname + '/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '172.29.96.1',
    user: 'dxrunpm',
    password: '0303',
    database: 'dbms-fb'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM tb_member;';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

//delete
app.put('/delete', function(req, res) {
    var sql = 'DELETE FROM tb_member WHERE id = ?';
    db.query(sql,[req.body.idkey],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function(req, res) {
    var sql = 'UPDATE tb_member SET fname= ? , lname = ? , tel = ? , email = ?  WHERE id = ?';
    db.query(sql,[req.body.fname,
                  req.body.lname,
                  req.body.tel,
                  req.body.email,
                  req.body.idkey],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//insert
app.post('/data', function(req, res){
    console.log(req.body);
    let data = {
        id:req.body.idkey,
        fname:req.body.fname,
        lname:req.body.lname,
        tel:req.body.tel,
        email:req.body.email
    };
    let sql = 'INSERT INTO tb_member SET ?';
    db.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            console.log("ID is Primarykey!!!!!");
            console.log("Enter the id again..");
        }else{
            console.log(result);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});




//module.exports = app;
module.exports = httpsServer;
