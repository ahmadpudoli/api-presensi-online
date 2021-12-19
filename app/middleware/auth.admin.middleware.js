const passport = require('passport');
const DefinedErrorResponse = require('../../utils/error.response');
const {responseApiError, responseApiSuccess} = require('../../utils/response-handler')

module.exports = function auth_admin_jwt(callback) {
	function proses_auth(req, res, next) {
		passport.authenticate('jwt', function(err, user, info) {
			//if (err) return next(err)
			if(err) return responseApiError(res, err);
			if (err || !user) {
				responseApiError(res, new DefinedErrorResponse('Otorisasi tidak valid!',null,401))
			}

			if(user.role != 'admin'){
				responseApiError(res, new DefinedErrorResponse('Otorisasi tidak valid, Anda bukan administrator!',null,401))
			}

			req.user = user
			return callback(req, res, next);
		})(req, res, next);
	}

	return proses_auth;
}