
exports.config_app = {
     secret_jwt: process.env.SECRET_JWT || 'sectret12345',
     expires_jwt: process.env.EXPIRES_JWT || '60m',
     redis : {
          host: process.env.REDIS_HOST ||  '127.0.0.1',
          port: process.env.REDIS_PORT ||  '6379',
          secret:  process.env.REDIS_SECRET || ''
     }
}
