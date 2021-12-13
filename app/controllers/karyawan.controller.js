const {db} = require('../../config/database');
const karyawan_model = require('../models/karyawan.model');
const user_model = require('../models/user.model');
const {responseApiSuccess, responseApiError} = require('../../utils/response-handler');
const {config_app} = require('../../config/application');
const e = require('express');
const {karyawanValidation} = require('../../utils/validation/karyawan.validation');
const ErrorResponse = require('../../utils/error.response');
const DefinedErrorResponse = require('../../utils/error.response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parseBool } = require('../../utils/customHelper');

// buat baru data karyawan
exports.buatKaryawanBaru = async function(req, res) {
  const transaction = await db.transaction();
    try{
        req.body = JSON.parse(JSON.stringify(req.body));
        let dataKaryawan = {};

        dataKaryawan['nip'] = req.body.hasOwnProperty('nip') ? req.body.nip : '';
        dataKaryawan['nama_karyawan'] = req.body.hasOwnProperty('nama_karyawan') ? req.body.nama_karyawan : '';
        dataKaryawan['alamat_karyawan'] = req.body.hasOwnProperty('alamat_karyawan') ? req.body.alamat_karyawan : '';
        dataKaryawan['no_hp'] = req.body.hasOwnProperty('no_hp') ? req.body.no_hp : '';
        dataKaryawan['jenis_kelamin'] = req.body.hasOwnProperty('jenis_kelamin') ? req.body.jenis_kelamin : '';
        dataKaryawan['email'] = req.body.hasOwnProperty('email') ? req.body.email : '';
        dataKaryawan['username'] = req.body.hasOwnProperty('username') ? req.body.username : '';
        dataKaryawan['role'] = req.body.hasOwnProperty('role') ? req.body.role : '';
        dataKaryawan['password'] = req.body.hasOwnProperty('password') ? req.body.password : '';
        dataKaryawan['password_confirm'] = req.body.hasOwnProperty('password_confirm') ? req.body.password_confirm : '';
        dataKaryawan['jabatan'] = req.body.hasOwnProperty('jabatan') ? req.body.jabatan : '';

        let withUser = req.body.hasOwnProperty('with_user') ? parseBool(req.body.with_user) : false;

        // validasi        
        let errors = karyawanValidation(dataKaryawan, withUser);
        if (errors) {
          return responseApiError(res, new DefinedErrorResponse('Formulir tidak valid!', errors));
        }

        const karyawan = await karyawan_model.createKaryawan(transaction, dataKaryawan);

        if(withUser){
          await user_model.createUser(transaction, dataKaryawan['username'], dataKaryawan['password'], karyawan.id_karyawan,
                            dataKaryawan.role);
        }

        transaction.commit();
        return responseApiSuccess(res, "Data Karyawan berhasil disimpan"); 

    }catch(e){
      transaction.rollback();
        return responseApiError(res, e);
    }
};

// ubah data karyawan
exports.ubahKaryawan = async function(req, res) {
  const transaction = await db.transaction();
  try{
      req.body = JSON.parse(JSON.stringify(req.body));
      let dataKaryawan = {};
      let idKaryawan = req.params.id_karyawan;

      dataKaryawan['nip'] = req.body.hasOwnProperty('nip') ? req.body.nip : '';
      dataKaryawan['nama_karyawan'] = req.body.hasOwnProperty('nama_karyawan') ? req.body.nama_karyawan : '';
      dataKaryawan['alamat_karyawan'] = req.body.hasOwnProperty('alamat_karyawan') ? req.body.alamat_karyawan : '';
      dataKaryawan['no_hp'] = req.body.hasOwnProperty('no_hp') ? req.body.no_hp : '';
      dataKaryawan['jenis_kelamin'] = req.body.hasOwnProperty('jenis_kelamin') ? req.body.jenis_kelamin : '';
      dataKaryawan['email'] = req.body.hasOwnProperty('email') ? req.body.email : '';
      dataKaryawan['username'] = req.body.hasOwnProperty('username') ? req.body.username : '';
      dataKaryawan['role'] = req.body.hasOwnProperty('role') ? req.body.role : '';
      dataKaryawan['password'] = req.body.hasOwnProperty('password') ? req.body.password : '';
      dataKaryawan['password_confirm'] = req.body.hasOwnProperty('password_confirm') ? req.body.password_confirm : '';
      dataKaryawan['jabatan'] = req.body.hasOwnProperty('jabatan') ? req.body.jabatan : '';
      
      let withUser = req.body.hasOwnProperty('with_user') ? parseBool(req.body.with_user) : false;

      // validasi        
      let errors = karyawanValidation(dataKaryawan, false);
      if (errors) {
        return responseApiError(res, new DefinedErrorResponse('Formulir tidak valid!', errors));
      }

      await karyawan_model.updateKaryawan(transaction, idKaryawan, dataKaryawan);
      if(withUser){
        let cekUser = await user_model.getUserByIdKaryawan(idKaryawan);
        if(cekUser){
          await user_model.updateUser(transaction, cekUser.id_user, dataKaryawan['username'], dataKaryawan['password'], idKaryawan,
                          dataKaryawan.role);
        }else{
          await user_model.createUser(transaction, dataKaryawan['username'], dataKaryawan['password'], idKaryawan,
                          dataKaryawan.role);
        }
        
      }
      await transaction.commit();
      return responseApiSuccess(res, "Data Karyawan berhasil diubah"); 

  }catch(e){
      await transaction.rollback();
      return responseApiError(res, e);
  }
};

// hapus data karyawan
exports.hapusKaryawan = async function(req, res) {
  const transaction = await db.transaction();
  try{
      let idKaryawan = req.params.id_karyawan;
      await user_model.deleteUserByIdKaryawan(transaction, idKaryawan);
      await karyawan_model.deleteKaryawan(transaction, idKaryawan);
      await transaction.commit();
      return responseApiSuccess(res, "Data Karyawan berhasil dihapus"); 

  }catch(e){
    await transaction.rollback();
      return responseApiError(res, e);
  }
};

// get list karyawan
exports.getDaftarKaryawan = async function(req, res) {
  try{   
    let key = req.query.key;
    let page = req.query.page;
    let listKaryawan = await karyawan_model.getListKaryawan(key,page );
    return responseApiSuccess(res, "Berhasil menarik data", listKaryawan)
    
  }catch(e){
    return responseApiError(res, e);
  }
};

// get list option karyawan
exports.getListOptionKaryawan = async function(req, res) {
  try{   
    let listKaryawan = await karyawan_model.getListOptionKaryawan();
    return responseApiSuccess(res, "Berhasil menarik data", listKaryawan)    
  }catch(e){
    return responseApiError(res, e);
  }
};

// get detail karyawan
exports.getDetailKaryawanById = async function(req, res) {
    try{   
      let id_karyawan = req.params.id_karyawan;
      let cek_karyawan = await karyawan_model.getKaryawanById(id_karyawan);

      if(cek_karyawan != null){
        return responseApiSuccess(res, 'karyawan ditemukan', cek_karyawan);
      }else{
        return responseApiError(res, new DefinedErrorResponse( 'Data karyawan dengan ' + id_karyawan + ' tidak ditemukan'));
      }
    }catch(e){
      return responseApiError(res, e);
    }
};
