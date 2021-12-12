const bcrypt = require('bcryptjs')
const crypto = require("crypto");


// menggunakan konsep async/await
exports.hash = async function(message){
    return new Promise((resolve, reject)=>{
        try{
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(message, salt);
            let result = {
                "salt" : salt,
                "hash" : hash
            }

            return resolve(result);
        }catch(e){
            return reject(e)
        }
        
    });    
}

// menggunakan konsep callback
exports.getHash = function(message, salt, callback){
    try{
        var hash = bcrypt.hashSync(message, salt);
        callback(null, hash);
    }catch(e){
        callback(e);
    }
}

// menggunakan konsep async/await
exports.guid = async function(){
    return new Promise((resolve, reject)=>{
        try{
            
            let id = crypto.randomBytes(16).toString("hex");
            return resolve(id);
        }catch(e){
            return reject(e)
        }
        
    });    
}