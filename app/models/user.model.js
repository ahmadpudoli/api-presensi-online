const util = require('util');
const utils = require("../../utils/generator-hash");

const {Sequelize, where, Op} = require('sequelize');
const {db} = require('../../config/database');
const DefinedErrorResponse = require('../../utils/error.response');
const { User, Karyawan } = require('.');
 
// relasi tabel
User.belongsTo(Karyawan, {as: 'karyawan', foreignKey: 'id_karyawan', targetKey: 'id_karyawan'});


//menggunakan konsep callback
module.exports.findByUsername = (koneksi, username, done)=>{
    try{
        var sql = 'select id_user,username,password,salt,id_karyawan,role from mst_user where username=?';
        var values = [username];

        koneksi.query(sql, values, function(err, result){
            if(err) {
                console.log(err);
                return done(err);
            }
            if(result.length > 0){
                    done(null, result[0]);
            }else{
                    done(new Error('User not found'));
            }
            
        })
    }catch(err){
        callback(err);
    }
}

// menggunakan konsep callback
exports.registerUser = function(koneksi, username, password, id_karyawan, role, callback){
    try{
        var sql_cek_username = 'select id_user,password,salt from mst_user where username=?';
        var values_cek_username = [username];

        // pertama apakah username sudah digunakan
        koneksi.query(sql_cek_username, values_cek_username,function(err, result){
            if(err){
                console.log(err);
                return callback(err);
            }

            if(result.length > 0){
                // jika data ditemukan artinya username sudah digunakan
                console.log("username = ", username, " sudah digunakan");
                return callback("username = " +username+" sudah digunakan");
            }else{
                // lakukan penambahan disini
                var sql_reg = 'insert into mst_user(id_user,username, password, salt, id_karyawan, role) values(?,?,?,?,?,?)';
    
                const generateHashSalt = utils.hash(password);
                const generateId = utils.hash(password+generateHashSalt.salt);

                var values_reg = [
                    generateId,
                    username,
                    generateHashSalt.hash,
                    generateHashSalt.salt,
                    id_karyawan,
                    role
                ]

                // proses insert dengan connection
                koneksi.query(sql_reg, values_reg, function(err, result){
                    if(err){
                        console.log(err);
                        return callback(err);
                    }

                    console.log("berhasil register user baru");
                    return callback(null, result)
                    
                })
            }
        })
    }catch(err){
        callback(err);
    }
}

// menggunakan konsep callback
exports.getProfile = async function(username, callback){
    var koneksi = await db.getKoneksi();
    try{
        var sql = 'select id,username,fullname,email from user where username=?';
        var values = [username];

        koneksi.query(sql, values, function(err, result){
            if(err){
                console.log(err);
                return callback(err);
            }
            console.log(result);
            return callback(null, result)
            
        })
    }catch(err){
        callback(err);
    }finally{
        koneksi.release();
    }
}


exports.getUser =  async function(username){  
    try {
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        return user;
    } catch (err) {
        throw err;
    }
}

exports.getUserById =  async function(id_user){  
    try {
        const user = await User.findOne({
            where: {
                id_user: id_user
            }
        });
        return user;
    } catch (err) {
        throw err;
    }
}

exports.getUserByIdKaryawan =  async function(id_karyawan){  
    try {
        const user = await User.findOne({
            where: {
                id_karyawan: id_karyawan
            }
        });
        return user;
    } catch (err) {
        throw err;
    }
}

exports.createUser = function(transaction, username, password, id_karyawan, role){
    return new Promise( async (resolve, reject)=>{
        try {       
            // lakukan penambahan disini
            const generateHashSalt = await utils.hash(password);
            const generateId = await utils.guid();

            var values = {
                id_user     : generateId,
                username    : username,
                password    : generateHashSalt.hash,
                salt        : generateHashSalt.salt,
                id_karyawan : id_karyawan,
                role        : role
            }

            cek_user = await this.getUser(username);
            if(cek_user){
                return reject(new DefinedErrorResponse("Username sudah digunakan"));
            }
            
            User.create(values, {transaction})
            .then(function (user) {
                if (user) {
                    return resolve(user);
                } else {
                    return reject(new DefinedErrorResponse('Gagal ketika insert data User'));
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

exports.updateUser = function(transaction, user_id, username, password, id_karyawan, role){
    return new Promise( async (resolve, reject)=>{
        try {       
                        
            cek_user = await this.getUser(username);
            if(cek_user && cek_user.id_karyawan !== id_karyawan){
                return reject(new DefinedErrorResponse("Username sudah digunakan"));
            }

            const generateHashSalt = await utils.hash(password);
            var values = {
                id_user     : user_id,
                username    : username,
                password    : generateHashSalt.hash,
                salt        : generateHashSalt.salt,
                id_karyawan : id_karyawan,
                role        : role
            }

            User.update(values, {
                transaction: transaction,
                where: {
                    [Op.and]: [ 
                        { id_user: user_id},
                        { id_karyawan : id_karyawan }
                    ]
                }
            })
            .then(function (user) {
                if (user) {
                    return resolve(user);
                } else {
                    return reject(new DefinedErrorResponse('Gagal ketika update data User'));
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

exports.deleteUserByIdKaryawan = function(transaction, id_karyawan){
    return new Promise( async (resolve, reject)=>{
        try { 
  
            await User.destroy({
                transaction: transaction,
                where: {
                    id_karyawan: id_karyawan
                }
            })
            .then(function (user) {
                if (user) {
                    return resolve(user);
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


/*
// menggunakan  promise pada saat meng-ekseskusi query
exports.getUser =  function(koneksi, username){            
    return new Promise((resolve, reject)=>{
        koneksi.query('select id_user,password,salt,username,id_karyawan,role from mst_user where username=? ',[username],  (error, result)=>{   
            try{
                //setTimeout(() => {
                    if(error){
                        return reject(error);
                    }
                    if(result.length <= 0){
                        return resolve(null);
                    }else{
                        return resolve(result[0]);
                    }
                //}, 10000);
            } catch(e){
                return reject(e);
            }      
        });
    });    
}

exports.getUserById =  function(koneksi, id_user){            
    return new Promise((resolve, reject)=>{
        koneksi.query('select id_user,password,salt,username,id_karyawan,role from mst_user where id_user=? ',[id_user],  (error, result)=>{   
            try{
                //setTimeout(() => {
                    if(error){
                        return reject(error);
                    }
                    if(result.length <= 0){
                        return resolve(null);
                    }else{
                        return resolve(result[0]);
                    }
                //}, 10000);
            } catch(e){
                return reject(e);
            }      
        });
    });    
}

// menggunakan konsep async/await
exports.registerWithTransaction = function(koneksi, username, password, id_karyawan, role){
    return new Promise( async (resolve, reject)=>{
        try {       
            // lakukan penambahan disini
            var sql_reg = 'insert into mst_user(id_user,username, password, salt, id_karyawan, role) values(?,?,?,?,?,?)';
    
            const generateHashSalt = await utils.hash(password);
            const generateId = await utils.guid();

            var values_reg = [
                generateId,
                username,
                generateHashSalt.hash,
                generateHashSalt.salt,
                id_karyawan,
                role
            ]
                
            // proses insert dengan connection
            koneksi.query(sql_reg, values_reg, async function(err, result){
                try{
                    // jika ada error maka akan direject
                    if(err) return reject(err);
                    // return dari function ada di sini
                    return resolve(result);
                }catch(e){
                    return reject(e);                        
                }
            }); 
            
        } catch ( err ) {
            return reject(err);
        } 
    });
        
  }
  */