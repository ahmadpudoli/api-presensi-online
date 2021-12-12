// dokumentasi validate.js ada disini https://validatejs.org/
const validate = require('validate.js');

exports.userValidation = (data) => {
    // user schema
    var constraint = {
        username: {
            presence: {
                allowEmpty: false
            }
        },
        password: {
            presence: {
                allowEmpty: false
            }
        },
        id_karyawan: {
            presence: {
                allowEmpty: false
            },
            //url: true
        },
        role: {
            presence: {
                allowEmpty: false
            },
        }
    };

    return validate(data, constraint, { format: 'flat' });
};