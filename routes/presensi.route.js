

module.exports = (app)=>{
  var express = require('express');
  var router = express.Router();
  const presensi_controller = require('../app/controllers/presensi.controller');
  const ErrorResponse = require('../utils/error.response');
  const auth_jwt = require('../app/middleware/auth.middleware')  
  const Multer = require('multer');
  const passport = require('passport');

  // route checkin
  // router.post('/checkin', 
  //   Multer({dest: "../temp-upload/"}).single("filecheckin"),
  //   auth_jwt(function(req, res, next) {
  //     try{
  //       presensi_controller.simpanCheckin(req, res);      
  //     }catch(e){
  //       next(e);
  //     }
  //   })
  // );

  router.post('/checkin', 
    passport.authenticate('jwt', {session: false}),
    // multer menggunakan path folder untuk penyimpanannya
    Multer({dest: "../temp-upload/"}).single("filecheckin"),
    function (req, res, next){
      presensi_controller.simpanCheckin(req, res);  
    }
  );

  // route checkout
  router.post('/checkout', 
    Multer({dest: "../temp-upload/"}).single("filecheckout"),
    auth_jwt(function(req, res, next) {
      try{
        presensi_controller.simpanCheckout(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  // route get list presensi karyawan perbulan
  router.get('/:id_karyawan/:tahun/:bulan', 
    auth_jwt(function(req, res, next) {
      try{
        presensi_controller.getPresensiKaryawanPerbulan(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  // route get list presensi karyawan perbulan
  router.get('/info-presensi-hari-ini', 
    auth_jwt(function(req, res, next) {
      try{
        presensi_controller.getInfoPresensiHariIni(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  app.use('/presensi', router)
}

