const util = require('util');
const utils = require("../../utils/generator-hash");

const {Sequelize, Op} = require('sequelize');
const {db} = require('../../config/database');
const DefinedErrorResponse = require('../../utils/error.response');
const { isNumber } = require('validate.js');
const { Presensi, Karyawan, User} = require('.');
const { lastDay } = require('../../utils/customHelper');
// init DataTypes
const { DataTypes } = Sequelize;

// relasi tabel
Presensi.hasOne(Karyawan, {as: 'karyawan', foreignKey: 'id_karyawan', targetKey: 'id_karyawan'});

exports.getPresensiById =  async function(id_presensi){  
  try {
      const presensi = await Presensi.findOne({
          where: {
            id_presensi: id_presensi
          },
          include: { 
            model: Karyawan, 
            as : 'karyawan', 
            attributes:['id_karyawan', 'nama_karyawan', 'nip', 'jenis_kelamin', 'email']
          }
      });
      return karyawan;
  } catch (err) {
      throw err;
  }
}

exports.getPresensiByTanggalPerKaryawan =  async function(tglPresensi, idKaryawan){  
    try {
        const presensi = await Presensi.findOne({
            where: {
                [Op.and]: [{
                        id_karyawan: idKaryawan
                    },
                    Sequelize.where(Sequelize.fn('date_format', Sequelize.col('tgl_presensi'), '%Y-%m-%d'), tglPresensi),              
                ]
            },
            include: { 
              model: Karyawan, 
              as : 'karyawan', 
              attributes:['id_karyawan', 'nama_karyawan', 'nip', 'jenis_kelamin', 'email']
            }
        });
        return presensi;
    } catch (err) {
        throw err;
    }
  }

exports.getListPresensiKaryawanPerbulan =  async function(idKaryawan, tahun, bulan){  
    try {
        tahun = (  Number(tahun) === 'NaN' || tahun == null || tahun == '') ? 2020 : tahun;
        bulan = (  Number(bulan) === 'NaN' || bulan == null || bulan == '') ? 1 : bulan;

        let kondisi =  {
                [Op.and]: [{
                        id_karyawan: idKaryawan
                    },
                    Sequelize.where(Sequelize.fn('year', Sequelize.col("tgl_presensi")), tahun),
                    Sequelize.where(Sequelize.fn('month', Sequelize.col("tgl_presensi")), bulan)                
                ]
            };
        

        let listPresensiKaryawan = await Presensi.findAll({ 
            where: kondisi ,
            sort: { tgl_presensi: 1 }
        });    

        let karyawan = await Karyawan.findOne({where: {id_karyawan : idKaryawan} });   
        
        if(karyawan == null){
            return {    
                'data'  : [], 
                'karyawan' : [], 
            };
        }
        
        let today = new Date();
        let day = today.getDate();  
        let month = today.getMonth() + 1;     // 10 (Month is 0-based, so 10 means 11th Month)
        let year = today.getFullYear(); 

        let tgl_terakhir = 1;
        if(year == tahun && bulan == month){
            tgl_terakhir = today.getDate();
        }else{
            tgl_terakhir = lastDay(tahun, bulan);
        }

        let new_list = [];
        for(let i= 1 ; i <= tgl_terakhir; i++){
            let get_item = listPresensiKaryawan.find(element =>  new Date(element.tgl_presensi).getDate() == i);
            let test = new Date(tahun, bulan-1, i, 0, 0, 0, 0);
            if(get_item != null){
                new_list.push(get_item);
            }else{
                new_list.push(new Presensi({
                    checkin:null,
                    checkout: null,
                    id_presensi: null,
                    id_karyawan: idKaryawan,
                    tgl_presensi: new Date(tahun, bulan-1, i, 0, 0, 0, 0),
                    status : 'TH'
                }));
            }
        }

        return {    
            'data'  : new_list, 
            'karyawan' : karyawan, 
        };
    } catch (err) {
        throw err;
    }
}

exports.simpanCheckin = function(tgl_presensi, id_karyawan, id_user, dataPresensi){
  return new Promise( async (resolve, reject)=>{
      try {       
          const generateIdCheckin = await utils.guid();

          var valuesCheckin = {
            id_presensi               : generateIdCheckin,
            tgl_presensi              : tgl_presensi,
            id_karyawan               : id_karyawan,
            checkin                   : dataPresensi.checkin,
            checkin_file_folder       : dataPresensi.checkin_file_folder,
            checkin_file_nama         : dataPresensi.checkin_file_nama,
            checkin_file_meta         : dataPresensi.checkin_file_meta,
            created_by                : id_user
          }
          
          Presensi.create(valuesCheckin)
          .then(function (presensi) {
              if (presensi) {
                  return resolve(presensi);
              } else {
                  return reject(new DefinedErrorResponse('Gagal ketika insert data Presensi'));
              }
          }) 
          .catch(err => {
                return reject(err)
          });
          
      } catch ( err ) {
          return reject(err);
      } 
  });
}

exports.simpanCheckout = function(tglPresensi, idKaryawan, dataPresensi){
    return new Promise( async (resolve, reject)=>{
        try {     
            
            let cekPresensi = await this.getPresensiByTanggalPerKaryawan(tglPresensi, idKaryawan);
            if(cekPresensi == null || cekPresensi.checkin == null ){
                return reject(new DefinedErrorResponse('Checkout tidak dapat disimpan karena belum melakukan Checkin'));
            }
            
  
            var valuesCheckout = {
              id_presensi                : cekPresensi.id_presensi,
              checkout                   : dataPresensi.checkout,
              checkout_file_folder       : dataPresensi.checkout_file_folder,
              checkout_file_nama         : dataPresensi.checkout_file_nama,
              checkout_file_meta         : dataPresensi.checkout_file_meta,
                status : 'H'
            }
            
            Presensi.update(valuesCheckout, {
                where : { id_presensi : valuesCheckout.id_presensi }
            })
            .then(function (presensi) {
                if (presensi) {
                    return resolve(presensi);
                } else {
                    return reject(new DefinedErrorResponse('Gagal ketika insert data Checkout'));
                }
            }) 
            .catch(err => {
                  return reject(err)
            });
            
        } catch ( err ) {
            return reject(err);
        } 
    });
  }
