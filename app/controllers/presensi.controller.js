const presensi_model = require('../models/presensi.model');
const user_model = require('../models/user.model');
const {responseApiSuccess, responseApiError} = require('../../utils/response-handler');
const db = require('../../config/database');
const {config_app} = require('../../config/application');
const e = require('express');
const {karyawanValidation} = require('../../utils/validation/karyawan.validation');
const ErrorResponse = require('../../utils/error.response');
const DefinedErrorResponse = require('../../utils/error.response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parseBool, formatDate, getExtension } = require('../../utils/customHelper');
const minioClient = require('../../config/minio.config');
const date = require('date-and-time');
const {format} = require('date-fns')

// fungsi melakukan checkin
exports.simpanCheckin = async function(req, res) {
  try{
    req.body = JSON.parse(JSON.stringify(req.body));

    if(req.file === undefined ){
      throw new DefinedErrorResponse("Tidak ditemukan file foto yang anda kirim !");
    }

    let lat = req.body.hasOwnProperty('lat') ? req.body.lat : '';
    let lang = req.body.hasOwnProperty('lang') ? req.body.lang : '';

    // dataKaryawan['lat'] = req.body.hasOwnProperty('lat') ? req.body.lat : '';
    // dataKaryawan['lang'] = req.body.hasOwnProperty('lang') ? req.body.lang : '';

    // validasi        
    // let errors = karyawanValidation(dataKaryawan, withUser);
    // if (errors) {
    //   return responseApiError(res, new DefinedErrorResponse('Formulir tidak valid!', errors));
    // }
    
    let tgl_presensi = date.format(new Date(), "YYYY-MM-DD");
    let id_karyawan = req.user.id_karyawan;
    let id_user = req.user.id_user;

    var dataCheckin = {
      checkin                   : date.format(new Date(), "YYYY-MM-DD HH:mm:ss"),
      checkin_file_folder       : "checkin/",
      //checkin_file_nama         : req.file.originalname,
      checkin_file_nama         : tgl_presensi + id_karyawan + "." + getExtension(req.file.originalname),
      checkin_file_meta         : { lat: lat, lang:lang  },
    }

    // validasi apakah sudah pernah melakukan checkin
    let presensiCheckin = await presensi_model.getPresensiByTanggalPerKaryawan(tgl_presensi, id_karyawan);
    if(presensiCheckin != null && presensiCheckin.checkin != null){
      throw new DefinedErrorResponse('Anda sudah melakukan checkin');
    }

    let metaData = {
        'Content-Type': req.file.mimetype,
    };
    // name bucket: bucket-presensi, folder path: checkin/
    await minioClient.putObject("bucket-presensi",dataCheckin.checkin_file_folder + dataCheckin.checkin_file_nama, req.file.path, metaData, function(error, etag) {
        if(error) {
            return responseApiError(res, error)
        }
    });   

    const checkin = await presensi_model.simpanCheckin(tgl_presensi, id_karyawan, id_user, dataCheckin);

    return responseApiSuccess(res, "Checkin berhasil disimpan", dataCheckin); 

  } catch(e){
      return responseApiError(res, e);
  }
};

// fungsi melakukan checkin
exports.simpanCheckout = async function(req, res) {
  try{
    req.body = JSON.parse(JSON.stringify(req.body));

    if(req.file === undefined ){
      throw new DefinedErrorResponse("Tidak ditemukan file foto yang anda kirim !");
    }

    let lat = req.body.hasOwnProperty('lat') ? req.body.lat : '';
    let lang = req.body.hasOwnProperty('lang') ? req.body.lang : '';

    // dataKaryawan['lat'] = req.body.hasOwnProperty('lat') ? req.body.lat : '';
    // dataKaryawan['lang'] = req.body.hasOwnProperty('lang') ? req.body.lang : '';

    // validasi        
    // let errors = karyawanValidation(dataKaryawan, withUser);
    // if (errors) {
    //   return responseApiError(res, new DefinedErrorResponse('Formulir tidak valid!', errors));
    // }
    
    let tgl_presensi = date.format(new Date(), "YYYY-MM-DD");
    let id_karyawan = req.user.id_karyawan;
    let id_user = req.user.id_user;

    var dataCheckout = {
      checkout                   : date.format(new Date(), "YYYY-MM-DD HH:mm:ss"),
      checkout_file_folder       : "checkout/",
      //checkout_file_nama         : req.file.originalname,
      checkout_file_nama         : tgl_presensi + id_karyawan + "." + getExtension(req.file.originalname),
      checkout_file_meta         : { lat: lat, lang:lang  },
    }

    // validasi apakah sudah pernah melakukan checkcheckout
    let presensiCheck = await presensi_model.getPresensiByTanggalPerKaryawan(tgl_presensi, id_karyawan);
    if(presensiCheck == null || presensiCheck.checkin == null){
      throw new DefinedErrorResponse('Anda belum melakukan checkin');
    } else if(presensiCheck != null && presensiCheck.checkout != null){
      throw new DefinedErrorResponse('Anda sudah melakukan checkout');
    }

    let metaData = {
        'Content-Type': req.file.mimetype,
    };
    // name bucket: bucket-presensi, folder path: checkin/
    await minioClient.putObject("bucket-presensi",dataCheckout.checkout_file_folder + dataCheckout.checkout_file_nama, req.file.path, metaData, function(error, etag) {
        if(error) {
            return responseApiError(res, error)
        }
    });   

    const checkout = await presensi_model.simpanCheckout(tgl_presensi, id_karyawan, dataCheckout);

    return responseApiSuccess(res, "Checkout berhasil disimpan", dataCheckout); 

  } catch(e){
      return responseApiError(res, e);
  }
};


// get list getPresensiKaryawanPerbulan
exports.getPresensiKaryawanPerbulan = async function(req, res) {
  try{   
    let id_karyawan = req.params.id_karyawan;
    let tahun = req.params.tahun;
    let bulan = req.params.bulan;
    let listPresensiKaryawan = await presensi_model.getListPresensiKaryawanPerbulan(id_karyawan, tahun, bulan);
    return responseApiSuccess(res, "Berhasil menarik data", listPresensiKaryawan)
    
  }catch(e){
    return responseApiError(res, e);
  }
};

// get mengambil informasi presensi hari ini untuk karyawan
exports.getInfoPresensiHariIni = async function(req, res) {
  try{   
    let id_karyawan = req.user.id_karyawan;
    let tglHariIni = format(new Date(), "yyyy-MM-dd", {  });
    let presensi =  await presensi_model.getPresensiByTanggalPerKaryawan(tglHariIni, id_karyawan);
    let retData = {
      tgl_presensi : tglHariIni,
      checkin : null,
      status_checkin : false,
      checkout :  null,   
      status_checkout : false
    };

    if(presensi != null){
      retData = {
        tgl_presensi :  format(presensi.checkin, "dd MMMM yyyy", {  }),
        checkin : (presensi.checkin !=null) ? format(presensi.checkin, "HH:mm:ss", {  }) : null,
        status_checkin : (presensi.checkin != null) ? true : false,
        checkout : (presensi.checkout !=null) ?  format(  presensi.checkout, "HH:mm:ss", {  }) : null,
        status_checkout : (presensi.checkout != null) ? true : false
      };
    }
    

    return responseApiSuccess(res, "Berhasil menarik data", retData)
    
  }catch(e){
    return responseApiError(res, e);
  }
};

// get detail karyawan
// exports.getDetailKaryawanById = async function(req, res) {
//     try{   
//       let id_karyawan = req.params.id_karyawan;
//       let cek_karyawan = await karyawan_model.getKaryawanById(id_karyawan);

//       if(cek_karyawan != null){
//         return responseApiSuccess(res, 'karyawan ditemukan', cek_karyawan);
//       }else{
//         return responseApiError(res, new DefinedErrorResponse( 'Data karyawan dengan ' + id_karyawan + ' tidak ditemukan'));
//       }
//     }catch(e){
//       return responseApiError(res, e);
//     }
// };
