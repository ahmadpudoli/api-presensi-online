const {db} = require('../../config/database');
const {Sequelize, where, Op} = require('sequelize');
const {deleteContainRedis} = require('../../utils/redis-helper');

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
Karyawan.afterCreate(async (karyawan, options) => {
  deleteContainRedis(':karyawan:');
});
Karyawan.afterUpdate(async (karyawan, options) => {
  deleteContainRedis(':karyawan:');
});
Karyawan.afterDestroy(async (karyawan, options) => {
  deleteContainRedis(':karyawan:');
});
Karyawan.afterBulkCreate(async (karyawan, options) => {
  deleteContainRedis(':karyawan:');
});
Karyawan.afterBulkUpdate(async (karyawan, options) => {
  deleteContainRedis(':karyawan:');
});
Karyawan.afterBulkDestroy(async (karyawan, options) => {
  deleteContainRedis(':karyawan:');
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
User.afterCreate(async (user, options) => {
  deleteContainRedis(':user:');
});
User.afterUpdate(async (user, options) => {
  deleteContainRedis(':user:');
});
User.afterDestroy(async (user, options) => {
  deleteContainRedis(':user:');
});
User.afterBulkCreate(async (user, options) => {
  deleteContainRedis(':user:');
});
User.afterBulkUpdate(async (user, options) => {
  deleteContainRedis(':user:');
});
User.afterBulkDestroy(async (user, options) => {
  deleteContainRedis(':user:');
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
                              },
  checkout                    : {type: Sequelize.DATE, allowNull: true },
  checkout_file_folder        : {type: Sequelize.STRING(255), allowNull: true },
  checkout_file_nama          : {type: Sequelize.STRING(255), allowNull: true },
  checkout_file_meta          : {
                                  type: Sequelize.TEXT, 
                                  allowNull: true,
                                },
  status                      : {type: Sequelize.STRING(1), allowNull: true },
  // createdAt                   : {type: Sequelize.DATE, allowNull: true, field: 'created_at' },
  // updatedAt                   : {type: Sequelize.STRING(100), allowNull: true, field: 'updated_at' },

},{
  // Freeze Table Name
  freezeTableName: true,
  timestamps: false
});
Presensi.afterCreate(async (presensi, options) => {
  deleteContainRedis(':presensi:');
});
Presensi.afterUpdate(async (presensi, options) => {
  deleteContainRedis(':presensi:');
});
Presensi.afterDestroy(async (presensi, options) => {
  deleteContainRedis(':presensi:');
});
Presensi.afterBulkCreate(async (presensi, options) => {
  deleteContainRedis(':presensi:');
});
Presensi.afterBulkUpdate(async (presensi, options) => {
  deleteContainRedis(':presensi:');
});
Presensi.afterBulkDestroy(async (presensi, options) => {
  deleteContainRedis(':presensi:');
});

 
 
 module.exports = {Karyawan, User, Presensi}


