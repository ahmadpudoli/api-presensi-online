
module.exports = (app)=>{
  var express = require('express');
  var router = express.Router();
  const karyawan_controller = require('../app/controllers/karyawan.controller');
  const ErrorResponse = require('../utils/error.response');
  const auth_jwt = require('../app/middleware/auth.middleware')

  // create
  router.post('/', 
    auth_jwt(function(req, res, next) {
      try{
        karyawan_controller.buatKaryawanBaru(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  // update
  router.put('/:id_karyawan', 
    auth_jwt(function(req, res, next) {
      try{
        karyawan_controller.ubahKaryawan(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  // delete
  router.delete('/:id_karyawan', 
    auth_jwt(function(req, res, next) {
      try{
        karyawan_controller.hapusKaryawan(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  router.get('/:id_karyawan', 
    auth_jwt(function(req, res, next) {
      try{
        karyawan_controller.getDetailKaryawanById(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  router.get('/', 
    auth_jwt(function(req, res, next) {
      try{
        karyawan_controller.getDaftarKaryawan(req, res);      
      }catch(e){
        next(e);
      }
    })
  );

  router.get('/option/list', 
    auth_jwt(function(req, res, next) {
      try{
        karyawan_controller.getListOptionKaryawan(req, res);      
      }catch(e){
        next(e);
      }
    })
  );
  

  app.use('/karyawans', router)
}

