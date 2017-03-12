module.exports = function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');

	if(req.method === 'OPTIONS') {
		res.status(200);
		res.send();
	}

	next();
};