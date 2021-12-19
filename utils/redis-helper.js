// menggunakan redis sebagai cache
const redisClient = require('./redisClient');

// contoh membuat function async/await untuk get dan set data redis
const getRedisAsync = async(key)=>{
    return new Promise((resolve, reject)=>{
        // example https://docs.redis.com/latest/rs/references/client_references/client_nodejs/
        redisClient.get(key, function(err, result){
            if(err) return reject(err);
            resolve(JSON.parse(result));            
        });
    });    
};

const setRedisAsync = async(key, value)=>{
    return new Promise((resolve, reject)=>{
        // example https://docs.redis.com/latest/rs/references/client_references/client_nodejs/
        redisClient.set(key, JSON.stringify(value), function(err, result){
          if(err) return reject(err);
          resolve(result);      
        });
        redisClient.expire(key, 60 * 60 ); // expired dalam 1 jam 60 * 60 => (60 detik x 60 menit)
    });    
};

const deleteRedisAsync = async(key)=>{
    return new Promise((resolve, reject)=>{
        // example https://docs.redis.com/latest/rs/references/client_references/client_nodejs/
        redisClient.del(key, function(err, result){
          if(err) return reject(err);
          resolve(result);       
        });
    });    
};

const deleteContainRedis = (key_contain, callback)=>{
     redisClient.keys('*', function (err, keys) {
        //if (err) return console.log(err);
        if(keys){
          keys.forEach(function(key, index){
               if(key.includes(key_contain)){
                    redisClient.del(key, callback)
               }
          });
        }
    });
};



module.exports = { getRedisAsync, setRedisAsync, deleteRedisAsync, deleteContainRedis};