
module.exports = (app)=>{
  var express = require('express');
  var router = express.Router();
  const user_controller = require('../app/controllers/user.controller');
  const ErrorResponse = require('../utils/error.response');
  const auth_jwt = require('../app/middleware/auth.middleware');
  const auth_admin_jwt = require('../app/middleware/auth.admin.middleware');

  router.post('/login', 
    function(req, res, next){
      //return next(new ErrorResponse('error error erroe', 400, {datanya:'dataku'}));
      try{
        user_controller.login(req, res);
      }catch(e){
        next(e);
      }
    }
  );


  // router.post('/register', function(req, res, next) {
  //   //return next(new ErrorResponse('error error erroe', 400, {datanya:'dataku'}));
  //   try{
  //     user_controller.registerNewUser(req, res);
  //   }catch(e){
  //     next(e);
  //   }
  // });

  // router.get('/test/:username', function(req, res, next) {
  //   user_controller.getDataUser(req, res);
  // });

  router.get('/:username', 
    auth_admin_jwt(function(req, res, next) {
      try{
        user_controller.getDataUser(req, res);      
      }catch(e){
        next(e);
      }
    })
  );
  

  app.use('/users', router)
}

