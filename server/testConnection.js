var mysql = require('mysql');

var con = mysql.createConnection({
  host: "172.29.96.1",
  user: "dxrunpm",
  password: "0303",
  database: 'dbms-fb'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

getDomain();

function getDomain() {
    return dbQuery('SELECT * FROM tb_member;');
}

// * Important promise function
function dbQuery(databaseQuery) {
    return new Promise(data => {
        con.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                throw error;
            }
            try {
                console.log(result);
            } catch (error) {
                throw error;
            }

        });
    });

}

    