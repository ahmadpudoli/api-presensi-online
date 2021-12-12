const user_model = require('../models/user.model');
const {responseApiSuccess, responseApiError} = require('../../utils/response-handler');
const db = require('../../config/database');
const {config_app} = require('../../config/application');
const e = require('express');
const {userValidation} = require('../../utils/validation/user.validation');
const ErrorResponse = require('../../utils/error.response');
const DefinedErrorResponse = require('../../utils/error.response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// login user
exports.login = async function(req, res) {
  
  try{   
    let user = await user_model.getUser( req.body.username);
    if(user == null){
      return responseApiError(res,new DefinedErrorResponse('username or password was invalid') );
    }
    let hash = bcrypt.hashSync(req.body.password, user.salt);
    if(hash !== user.password){
      return responseApiError(res,new DefinedErrorResponse('username or password was invalid') );
    }
    console.log('generate jwt-token');
    let payload = {
      id_user: user.id_user,
      username: user.username,
      id_karyawan: user.id_karyawan,
      role:user.role
    };

    let token = jwt.sign(payload, 
      config_app.secret_jwt,
        {
          expiresIn: config_app.expires_jwt // expires in 5 minutes
        }
      );

    return responseApiSuccess(res, 
        'Authentication successful !',
        { token:token,
          role:user.role,
          id_karyawan: user.id_karyawan
        });
  }catch(e){
    return responseApiError(res, e);
  }
};

// register new data user
exports.registerNewUser = async function(req, res) {
    try{
        req.body = JSON.parse(JSON.stringify(req.body));
        let usr = req.body.hasOwnProperty('username') ? req.body.username : '';
        let pwd = req.body.hasOwnProperty('password') ? req.body.password : '';
        let idKaryawan = req.body.hasOwnProperty('id_karyawan') ? req.body.id_karyawan : '';
        let role = req.body.hasOwnProperty('role') ? req.body.role : '';

        // validasi
        let errors = userValidation({username:usr, password: pwd, id_karyawan:idKaryawan, role:role});
        if (errors) {
          return responseApiError(res, new DefinedErrorResponse('Formulir tidak valid!', errors));
        }

        let cek_user = await user_model.getUser(usr);
        if(cek_user != null){
          return responseApiError(res, new DefinedErrorResponse('User '+usr+' sudah digunakan') );
        }
        await user_model.createUser(usr, pwd, idKaryawan, role);
        return responseApiSuccess(res, "registrasi akun dengan username " + usr + " berhasil"); 

    }catch(e){
        return responseApiError(res, e);
    }
};

// cek data user
exports.getDataUser = async function(req, res) {
    try{   
      var usr = req.params.username;
      var cek_user = await user_model.getUser( usr);

      if(cek_user != null){
        return responseApiSuccess(res, 'pengguna ditemukan', cek_user);
      }else{
        return responseApiError(res, new DefinedErrorResponse( 'username ' + req.params.username + ' tidak ditemukan'));
      }
    }catch(e){
      return responseApiError(res, e);
    }
};
