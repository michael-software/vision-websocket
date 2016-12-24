var fetch = require('node-fetch');

class SearchHelper {
	constructor(loginHelper) {
		this.loginHelper = loginHelper;
	}

	setLoginHelper(loginHelper) {
		this.loginHelper = loginHelper;
	}

	getSearch(query) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {
			if (this.loginHelper.getServer() && this.loginHelper.getToken()) {
				let url = `${this.loginHelper.getServer()}/api/search.php?format=jui&query=${query}`;

				return fetch(url, {
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

            reject('unknown error');
		});
	}
}

module.exports = SearchHelper;