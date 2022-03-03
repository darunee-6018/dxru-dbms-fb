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
    host: '172.23.112.1',
    user: 'dxrunpm',
    password: '0303',
    database: 'dbms-fb'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM `tb_member` JOIN `province` ON tb_member.province = province.provinceId JOIN `district` ON tb_member.district = district.districtId JOIN `subdistrict` ON tb_member.subdistrict = subdistrict.subdistrictId JOIN village ON tb_member.village = village.villageId ORDER BY `tb_member`.`id` ASC;';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show province
app.get('/provinces', function(req,res){
    let sql = 'SELECT * FROM `province`';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show district with province
app.get('/districts', function(req,res){
    let sql = 'SELECT * FROM `district` WHERE provinceId = ?';
    db.query(sql, [req.query.provinceId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show subdistrict with district
app.get('/subdistricts', function(req,res){
    let sql = 'SELECT * FROM `subdistrict` WHERE districtId = ?';
    db.query(sql, [req.query.districtId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show village with subdistrict
app.get('/villages', function(req,res){
    let sql = 'SELECT * FROM `village` WHERE subdistrictId = ?';
    db.query(sql, [req.query.subdistrictId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
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
    var sql = 'UPDATE tb_member SET fname= ? , lname = ? , tel = ? , province = ?, district = ?, subdistrict = ?, village = ?  WHERE id = ?';
    db.query(sql,[req.body.fname,
                  req.body.lname,
                  req.body.tel,

                  req.body.province,
                  req.body.district,
                  req.body.subdistrict,
                  req.body.village,

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
        email:req.body.email,

        province: req.body.province,
        district: req.body.district,
        subdistrict: req.body.subdistrict,
        village: req.body.village,
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
