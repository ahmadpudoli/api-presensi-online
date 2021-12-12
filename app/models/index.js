const {db} = require('../../config/database');
const {Sequelize, where, Op} = require('sequelize');

// Define schema Tabel mst_karyawan
const Karyawan = db.define('mst_karyawan', {
     // Define attributes
     id_karyawan         : {type: Sequelize.STRING(36), primaryKey: true, autoIncrement: false, allowNull: false },
     nip                 : {type: Sequelize.STRING(15), allowNull: false },
     nama_karyawan       : {type: Sequelize.STRING(255), allowNull: false },
     alamat_karyawan     : {type: Sequelize.STRING(255), allowNull: false },
     no_hp               : {type: Sequelize.STRING(36), allowNull: true },
     jenis_kelamin       : {type: Sequelize.STRING(1), allowNull: false },
     jabatan             : {type: Sequelize.STRING(50), allowNull: true },
     email               : {type: Sequelize.STRING(100), allowNull: true },
 },{
   // Freeze Table Name
   freezeTableName: true,
   timestamps: false
 });

 
 // Define schema Tabel mst_user
const User = db.define('mst_user', {
     // Define attributes
     id_user         : {type: Sequelize.STRING(36), primaryKey: true, autoIncrement: false, allowNull: false },
     username        : {type: Sequelize.STRING(50), allowNull: false },
     password        : {type: Sequelize.STRING(255), allowNull: false },
     salt            : {type: Sequelize.STRING(255), allowNull: false },
     id_karyawan     : {type: Sequelize.STRING(36), allowNull: true },
     role            : {type: Sequelize.STRING(255), allowNull: true },
 },{
   // Freeze Table Name
   freezeTableName: true,
   timestamps: false
 });

 // Define schema Tabel trs_presensi
const Presensi = db.define('trs_presensi', {
  // Define attributes
  id_presensi                 : {type: Sequelize.STRING(36), primaryKey: true, autoIncrement: false, allowNull: false },
  id_karyawan                 : {type: Sequelize.STRING(15), allowNull: false },
  tgl_presensi                : {type: Sequelize.DATE, allowNull: false },
  checkin                     : {type: Sequelize.DATE, allowNull: true },
  checkin_file_folder         : {type: Sequelize.STRING(255), allowNull: true },
  checkin_file_nama           : {type: Sequelize.STRING(255), allowNull: true },
  checkin_file_meta           : {
                                type: Sequelize.TEXT, 
                                allowNull: true,
                                get: function() {
                                  let val = this.getDataValue("checkin_file_nama");
                                  return ( val != null ) ? JSON.parse(this.getDataValue("checkin_file_nama")): null;
                                },
                                set: function(value) {
                                  let val = this.getDataValue("checkin_file_nama");
                                  return ( val != null ) ? this.setDataValue("checkin_file_nama", JSON.stringify(value)) : null;
                                }
                              },
  checkout                    : {type: Sequelize.DATE, allowNull: true },
  checkout_file_folder        : {type: Sequelize.STRING(255), allowNull: true },
  checkout_file_nama          : {type: Sequelize.STRING(255), allowNull: true },
  checkout_file_meta          : {
                                  type: Sequelize.TEXT, 
                                  allowNull: true,
                                  get: function() {
                                    let val = this.getDataValue("checkout_file_meta");
                                    return ( val != null ) ? JSON.parse(this.getDataValue("checkout_file_meta")) : null ;
                                  },
                                  set: function(value) {
                                    let val = this.getDataValue("checkout_file_meta");
                                    return ( val != null ) ? this.setDataValue("checkout_file_meta", JSON.stringify(value)) : null;
                                  }
                                },
  status                      : {type: Sequelize.STRING(1), allowNull: true },
  // createdAt                   : {type: Sequelize.DATE, allowNull: true, field: 'created_at' },
  // updatedAt                   : {type: Sequelize.STRING(100), allowNull: true, field: 'updated_at' },

},{
  // Freeze Table Name
  freezeTableName: true,
  timestamps: false
});

 
 
 module.exports = {Karyawan, User, Presensi}


