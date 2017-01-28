const LoginHelper = require('../../utils/helper/LoginHelper');
const ConnectionHelper = require('../ConnectionHelper');

let server;

module.exports = function(config) {
	server = config;

	return middleware;
};

function middleware(request, response, next) {
	let promise = new Promise((resolve, reject) => {

		let token = getTokenFromHeader(request.headers) || getTokenFromUrl(request.query);

		if (!isValidToken(token)) {
			response.status(401);

			return reject('No Authorization');
		}

		request.connectionHelper = new ConnectionHelper(server);
		request.loginHelper = new LoginHelper(request.connectionHelper);

		request.loginHelper.loginToken('jhsdjksad', token).then((user) => {
			request.connectionHelper.register(request.loginHelper, user);

			return resolve();
		}).catch((error) => {
			response.status(403);

			return reject('No Authorization');
		});

		console.log(token);
	});

	promise.then(() => {
		next();
	}).catch((error) => {
		response.send(error);
	});
}


function getTokenFromHeader(headers) {
	if(!headers.authorization) return null;

	if(!headers.authorization.toLowerCase().startsWith('bearer')) return null;

	return headers.authorization.replace(/bearer /i, '');
}

function getTokenFromUrl(query) {
	if(!query.jwt) return null;

	return query.jwt;
}

function isValidToken(token) {
	if(!token) return false;

	token = String(token).split('.');

	return token.length === 3;
}