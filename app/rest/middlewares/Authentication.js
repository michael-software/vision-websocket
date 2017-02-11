const LoginHelper = require('../../utils/helper/LoginHelper');
const ConnectionHelper = require('../../utils/helper/ConnectionHelper');

let server;

module.exports = function(config) {
	server = config;

	return middleware;
};

function middleware(request, response, next) {
	let promise = new Promise((resolve, reject) => {

		request.connectionHelper = new ConnectionHelper(server);
		request.loginHelper = request.connectionHelper.getLoginHelper();

		let token = getTokenFromHeader(request.headers) || getTokenFromUrl(request.query);

		if(token) {
			return loginWithToken(request, response, token).then(() => {
				return resolve();
			}).catch(() => {
				return reject();
			});
		}

		let credentials = getCredentialsFromHeader(request.headers);

		if(credentials) {
			return loginWithCredentials(request, response, credentials).then(() => {
				return resolve();
			}).catch(() => {
				return reject();
			});
		}


		return reject('no credentials');
	});

	promise.then(() => {
		next();
	}).catch((error) => {
		response.status(401);
		response.send(error);
	});
}


function loginWithToken(request, response, token) {
	if (!isValidToken(token)) {
		response.status(401);

		return Promise.reject('No Authorization');
	}

	return request.loginHelper.loginToken(null, token).then((user) => {
		return Promise.resolve(user);
	}).catch((error) => {
		response.status(403);

		return Promise.reject('No Authorization');
	});
}

function loginWithCredentials(request, response, credentials) {
	if(!isValidCredentials(credentials)) return Promise.reject();

	credentials = parseCredentials(credentials);

	return request.connectionHelper.getLoginHelper().loginCredentials('jkhk', credentials[0], credentials[1]);
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

function getCredentialsFromHeader(headers) {

	if(!headers.authorization) return null;

	if(!headers.authorization.toLowerCase().startsWith('basic')) return null;

	return headers.authorization.replace(/basic /i, '');
}

function isValidCredentials(credentials) {
	if(!credentials) return false;

	credentials = parseCredentials(credentials);

	return credentials.length === 2;
}

function parseCredentials(credentials) {
	try {
		credentials = Buffer.from(credentials, 'base64').toString();

		return credentials.split(':');
	} catch(error) {
		return null;
	}
}