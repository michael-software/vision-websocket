const PromiseMiddleware = require('./middlewares/Promises');
const AuthenticationMiddleware = require('./middlewares/Authentication');
const PluginHelper = require('../utils/helper/PluginHelper/PluginHelper');

class RestManager {
	constructor(express, config) {
		express.use(PromiseMiddleware);
		express.use(AuthenticationMiddleware(config));

		express.get('/login', function (req, res) {
			res.promise(new Promise((resolve, reject) => {
				let currentUser = req.connectionHelper.getUserHelper().getCurrentUser().getObject();
				currentUser.authtoken = req.connectionHelper.getLoginHelper().getToken();

				resolve({
					data: currentUser
				});
			}));
		});

		express.get('/plugins', function (req, res) {
			res.promise(new Promise((resolve, reject) => {
				let plugins = req.connectionHelper.getPluginHelper().getPlugins().values();


				let pluginArray = [];
				for(let plugin of plugins) {
					pluginArray.push(plugin);
				}

				return resolve({
					data: pluginArray
				});
			}));
		});

		express.get('/plugin', function (req, res) {
			res.promise(new Promise((resolve, reject) => {
				let plugins = req.connectionHelper.getPluginHelper().getPlugin(req.query.id, req.query.view, req.query.param);

				plugins.then((data) => {
					return resolve(data);
				});
			}));
		});

		express.get('/search', function (req, res) {
			res.promise(new Promise((resolve, reject) => {
				let query = req.query.query;

				if(req.query.format === 'jui') {
					req.connectionHelper.getSearchHelper().getSearchView(query).then((data) => {
						return resolve({
							data: data.getArray(),
							head: null
						});
					});
				} else {
					req.connectionHelper.getSearchHelper().getSearch(query).then((data) => {
						return resolve(data);
					});
				}
			}));
		});

		express.get('/file', function (req, res) {
			res.promise(new Promise((resolve, reject) => {
				let fileHelper = req.connectionHelper.getFileHelper();
				let path = req.query.path;
				let isAllowed = fileHelper.isAllowed(fileHelper.TYPE_PRIVATE);

				console.log(path);

				if(!path) return reject();
				if(!isAllowed) return reject();


				res.sendFile(path, { root: fileHelper.getUserFileDirectory() }, (err) => {
					if(err) {
						res.statusCode = 404;
						return reject(err);
					}
				});
			}));
		});
	}
}

module.exports = RestManager;