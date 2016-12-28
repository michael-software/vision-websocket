const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const Tools = require('../Tools');

class PluginHelper {
	constructor(socketHelper) {
		this.socketHelper = socketHelper;
		this.uploadHelper = socketHelper.getUploadHelper();
		this.loginHelper = socketHelper.getLoginHelper();
	}

	setLoginHelper(loginHelper) {
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
			} else {
                reject('unknown error 2');
            }
		});
	}

	getPlugin(name, view, param, formData) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {
            console.log(this.loginHelper);
			if (this.loginHelper.getServer() && this.loginHelper.getToken()) {
				let url = `${this.loginHelper.getServer()}/api/plugin.php?plugin=${name}`;
				if(view) {
					url += `&page=${view}`;
				}
				if(param) {
					url += `&cmd=${param}`;
				}


				let data = new FormData();
				let config = {
                    headers: {
                        Authorization: `bearer ${this.loginHelper.getToken()}`
                    },
					method: 'GET'
                };

				if(formData) {
					//let uploadHelper = this.socketHelper.uploadHelper;
					console.log('formdata', formData);

					let promises = [];
					let keys = [];

					for(let key in formData) {
						if(!formData.hasOwnProperty(key)) continue;

						if(!formData[key].type) {
							data.append(key, formData[key]);
						} else if(formData[key].type == 'filelist') {
							let filelist = formData[key];

                            for(let index in filelist) {
								if(filelist.hasOwnProperty(index)) {

									if(Tools.isNumeric(index) && Tools.isNumeric(filelist[index])) {
                                        keys[filelist[index]] = key;
										promises.push(this.uploadHelper.getUploaded(filelist[index]));
                                    }
                                }
                            }
						}
					}

                    config.method = 'POST';
					config.body = data;

					Promise.all(promises).then((data) => {
						for(let i = 0, z = data.length; i < z; i++) {
                        	config.body.append(keys[ data[i]['id'] ], fs.createReadStream(data[i]['path']));
						}

                        //config.body.append('');
                        this.fetchPlugin(url, config, resolve, reject);
					})
				} else {
					this.fetchPlugin(url, config, resolve, reject);
				}
			} else {
                reject('unknown error');
			}
		});
	}

	fetchPlugin(url, config, resolve, reject) {
        return fetch(url, config).then(function (response) {
            if (!response) {
                throw new Error('Bad response');
            }

            resolve(response.text());

            //resolve( data.json() );
        }).then((response) => {
            if (!response) {
                throw new Error('Bad response');
            }

            resolve(JSON.parse(response));
        }).catch(reject);
	}
}

module.exports = PluginHelper;