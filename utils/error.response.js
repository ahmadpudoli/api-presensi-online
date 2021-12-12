
class ErrorResponse extends Error {
     constructor(message, statusCode, data=null) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
 }

 class DefinedErrorResponse extends Error {
    constructor(message, data=null, statusCode=400,) {
       super(message);
       this.statusCode = statusCode;
       this.data = data;
   }
}

 
 module.exports = ErrorResponse;
 module.exports = DefinedErrorResponse;