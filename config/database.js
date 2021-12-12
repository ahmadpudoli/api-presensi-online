/*
var mysql = require('mysql');
var util = require('util');

// buat konfigurasi koneksi
// referensi https://github.com/mysqljs/mysql
var pool = mysql.createPool({
    connectionLimit:4,
    host: process.env.DB_HOST,
    user:  process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    multipleStatements: true
});

var pool2 = mysql.createConnection({
  host: process.env.DB_HOST,
  user:  process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  multipleStatements: true
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1')
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

exports.getKoneksi =  async function () {
    const connection = new Promise((resolve, reject) => {
      pool.getConnection((ex, connection) => {
        if (ex) {
          reject(ex);
        } else {
          resolve(connection);
        }
      });
    });
    return await connection;
  }

// koneksi database

pool2.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});
exports.pool2 = pool2;

exports.pool = pool;
*/

const {Sequelize} = require('sequelize');
 
// create connection
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});

module.exports.db = db;
 