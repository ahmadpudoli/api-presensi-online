var express = require('express');
module.exports = (app)=>{
  
  require('./users.route')(app);
  require('./karyawan.route')(app);
  require('./presensi.route')(app);
};

