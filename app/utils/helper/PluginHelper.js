var fetch = require('node-fetch');

class PluginHelper {
	constructor(loginHelper) {
		this.loginHelper = loginHelper;
	}

	getPlugins(data) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {
			if (this.loginHelper.getServer() && this.loginHelper.getToken()) {
				return fetch(`${this.loginHelper.getServer()}/api/plugins.php`, {
					headers: {
						Authorization: `bearer ${this.loginHelper.getToken()}`
					}
				}).then(function (data) {
					if (!data) {
						throw new Error('Bad response');
					}

					resolve( data.json() );
				}).catch(reject);
			}
		});
	}
}

module.exports = PluginHelper;