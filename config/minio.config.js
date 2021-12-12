const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9001,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password',
});

module.exports = minioClient;
