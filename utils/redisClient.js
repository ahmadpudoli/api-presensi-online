const redis = require('redis');
const { config_app } = require('../config/application')

const redisClient = redis.createClient({
  host: config_app.redis.host,
  port: config_app.redis.port,
  password: config_app.redis.secret
})
redisClient.unref()
redisClient.on('ready', () => {
  console.log('✅ redis is ready');
})
redisClient.on('connect', () => {
     console.log('✅ redis is connected');
})
redisClient.on('reconnecting', () => {
     console.log('✅ redis is reconnecting');
})
redisClient.on('end', () => {
     console.log('✅ redis is end');
})
redisClient.on('error', (error) => {
     console.log(error);
})

module.exports = redisClient;