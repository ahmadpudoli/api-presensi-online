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


exports.karyawanValidation = (data, with_user = false) => {
    // user schema
    let constraint = {
        nip: {
            presence: {
                allowEmpty: false
            }
        },
        nama_karyawan: {
            presence: {
                allowEmpty: false
            }
        },
        alamat_karyawan: {
            presence: {
                allowEmpty: false
            },
            //url: true
        },
        no_hp: {
            presence: {
                allowEmpty: false
            },
        },
        no_hp: {
            presence: {
                allowEmpty: false
            },
        },
        jenis_kelamin: {
            presence: {
                allowEmpty: false
            },
        },
        email: {
            presence: {
                allowEmpty: false
            },
        }
    };

    if(with_user == true){
        constraint['username'] = {
            presence: {
                allowEmpty: false
            },
        };
        
        constraint['role'] = {
            presence: {
                allowEmpty: false
            },
        };
        constraint['password'] = {
            presence: {
                allowEmpty: false
            },
        };
        constraint['password_confirm'] = {
            presence: {
                allowEmpty: false
            },
        }
    }

    return validate(data, constraint, { format: 'flat' });
};