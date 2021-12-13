const util = require('util');
const utils = require("../../utils/generator-hash");

const {Sequelize, Op} = require('sequelize');
const {db} = require('../../config/database');
const DefinedErrorResponse = require('../../utils/error.response');
const { isNumber } = require('validate.js');
const { Karyawan, User, Presensi } = require('.');
// init DataTypes
const { DataTypes } = Sequelize;

// relasi tabel
Karyawan.hasOne(User, {as: 'user', foreignKey: 'id_karyawan', targetKey: 'id_karyawan'});
Karyawan.hasMany(Presensi, {as: 'presensi', foreignKey: 'id_karyawan', targetKey: 'id_karyawan'});

exports.getKaryawanById =  async function(id_karyawan){  
  try {
      const karyawan = await Karyawan.findOne({
          where: {
              id_karyawan: id_karyawan
          },
          include: { 
            model: User, 
            as : 'user', 
            attributes:['username', 'role']
          }
      });
      return karyawan;
  } catch (err) {
      throw err;
  }
}

exports.getKaryawanByNip =  async function(nip){  
  try {
      const karyawan = await Karyawan.findOne({
          where: {
              nip: nip
          },
          include: { 
            model: User, 
            as : 'user', 
            attributes:['username', 'role']
          }
      });
      return karyawan;
  } catch (err) {
      throw err;
  }
}

exports.getListKaryawan =  async function(key, page){  
    try {
        page = ( Number(page) === 'NaN' || page == null || page == '') ? 1 : page;
        let limit = 5;   // number of records per page
        let offset = 0;    // page number
		offset = limit * (page - 1);


        let kondisi = null;
        if(key != null && key !=''){
            kondisi =  {
                [Op.or]: [{
                        nip: {
                            [Op.like]: `%${key}%`
                        }
                    },
                    {
                        nama_karyawan: {
                            [Op.like]: `%${key}%`
                        }
                    }
                ]
            };
        }

        let data = await Karyawan.findAndCountAll({ where: kondisi }); 
        let pages = Math.ceil(data.count / limit); 
        let listKaryawan = await Karyawan.findAll({ 
            where: kondisi ,
            limit: limit,
            offset: offset,
            order: [
                ['nama_karyawan', 'ASC'],
            ],
            include: { 
                model: User, 
                as : 'user', 
                attributes:['username', 'role']
            }
        });    

        
        
        return {    
            'data'  : listKaryawan, 
            'total' : data.count, 
            'last_page': pages, 
            'current_page': page,
            'per_page' : limit
        };
    } catch (err) {
        throw err;
    }
}

exports.getListOptionKaryawan =  async function(){  
    try {
        let listKaryawan = await Karyawan.findAll({ 
            order: [
                ['nama_karyawan', 'ASC'],
            ],
        });    

        let arr_option = [];
        listKaryawan.forEach(element => {
            arr_option.push({id: element.id_karyawan, text: "[NIP:"+element.nip + "] " + element.nama_karyawan });
        });
        
        return arr_option;

    } catch (err) {
        throw err;
    }
}

exports.createKaryawan = function(transaction, data_karyawan){
  return new Promise( async (resolve, reject)=>{
      try {       
          const generateIdKaryawan = await utils.guid();

          var valuesKaryawan = {
              id_karyawan           : generateIdKaryawan,
              nip                   : data_karyawan.nip,
              nama_karyawan         : data_karyawan.nama_karyawan,
              alamat_karyawan       : data_karyawan.alamat_karyawan,
              no_hp                 : data_karyawan.no_hp,
              jenis_kelamin         : data_karyawan.jenis_kelamin,
              email                 : data_karyawan.email,
              jabatan               : data_karyawan.jabatan
          }
          
          let cek_karyawan_nip =  await this.getKaryawanByNip(valuesKaryawan.nip);
          if(cek_karyawan_nip != null){
            return reject(new DefinedErrorResponse('Karyawan dengan NIP ' + valuesKaryawan.nip + " sudah ada"));
          }

          Karyawan.create(valuesKaryawan, {transaction})
          .then(function (karyawan) {
              if (karyawan) {
                  return resolve(karyawan);
              } else {
                  return reject(new DefinedErrorResponse('Gagal ketika insert data Karyawan'));
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

exports.updateKaryawan = function(transaction, id_karyawan, data_karyawan){
    return new Promise( async (resolve, reject)=>{
        try {         
            var valuesKaryawan = {
                id_karyawan           : id_karyawan,
                nip                   : data_karyawan.nip,
                nama_karyawan         : data_karyawan.nama_karyawan,
                alamat_karyawan       : data_karyawan.alamat_karyawan,
                no_hp                 : data_karyawan.no_hp,
                jenis_kelamin         : data_karyawan.jenis_kelamin,
                email                 : data_karyawan.email,
                jabatan               : data_karyawan.jabatan
            }
            
            let cek_karyawan_nip =  await this.getKaryawanByNip(valuesKaryawan.nip);
            if(cek_karyawan_nip != null && cek_karyawan_nip.id_karyawan != id_karyawan){
              return reject(new DefinedErrorResponse('Karyawan dengan NIP ' + valuesKaryawan.nip + " sudah ada"));
            }
  
            await Karyawan.update(valuesKaryawan, {
                transaction: transaction,
                where: {
                    id_karyawan: id_karyawan
                }
            })
            .then(function (karyawan) {
                if (karyawan) {
                    return resolve(karyawan);
                } else {
                    return resolve(null);
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

  exports.deleteKaryawan = function(transaction, id_karyawan){
    return new Promise( async (resolve, reject)=>{
        try { 
  
            await Karyawan.destroy({
                transaction: transaction,
                where: {
                    id_karyawan: id_karyawan
                }
            })
            .then(function (karyawan) {
                if (karyawan) {
                    return resolve(karyawan);
                } else {
                    return reject(new DefinedErrorResponse('Gagal ketika hapus data Karyawan'));
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
