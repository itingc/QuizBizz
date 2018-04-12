var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
	//grab token value
	var token = req.header('x-auth');
	User.findByToken(token).then((user) => {
		if (!user) {
			return new Promise.reject("User from token not found");
		}
		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		console.log(`token: ${token}`);
	})
}

module.exports = {authenticate};