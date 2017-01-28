const PromiseMiddleware = require('./middlewares/Promises');
const AuthenticationMiddleware = require('./middlewares/Authentication');

class RestManager {
	constructor(express, config) {
		express.use(PromiseMiddleware);
		express.use(AuthenticationMiddleware(config));

		express.get('/login', function (req, res) {
			console.log(req.connectionHelper.getUserHelper().getCurrentUser());

			res.promise(new Promise((resolve, reject) => {
				resolve({
					data: req.connectionHelper.getUserHelper().getCurrentUser().getObject()
				});
			}));
		});
	}
}

module.exports = RestManager;