const DefinedErrorResponse = require("./error.response");

const responseApiSuccess = function (response, message, values = null, status_code=200) {
    let statusCode = status_code || 200;
    var data = {
        success: true,
        result: (values == null) ? null : values,
        message: message
    };
    response.status(statusCode).json(data);
    response.end();
};

const responseApiError = function (response, err) {
    let statusCode = null;
    let data = null;
    let msg = null;
    if( err instanceof DefinedErrorResponse){
        statusCode = err.statusCode;
        data = err.data;
        msg = err.message;
    }
    let error = {...err}; 
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    response.status(statusCode || error.statusCode).json({
        success: false,
        message: msg || ( (process.env.MODE_DEBUG == 'true' ) ? error.message :  'Internal Server error'),
        result: data || null,
        stack: (process.env.MODE_DEBUG == 'true' ) ? err.stack : null 
    });
    
    response.end();
};


module.exports = { responseApiSuccess, responseApiError };