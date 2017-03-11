var fetch = require('node-fetch');
var FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');

const JwtHelper = require('./JwtHelper');
const PasswordHelper = require('./PasswordHelper');


class LoginHelper {
    constructor(socketHelper) {
        if(socketHelper.getDatabaseHelper) {
            this.socketHelper = socketHelper;
            this.jwtHelper = new JwtHelper(socketHelper);
        }
    }

    loginToken(server, authtoken) {

		if(this.socketHelper) {
			return new Promise((resolve, reject) => {
				this.jwtHelper.validate(authtoken).then((data) => {
					console.log('validated', data);

					let loginData = {
						server: server || data.server,
						username: data.username,
						id: data.id,
						token: authtoken
					};

					this.parseLoginInfo(loginData);

					console.log('loginData send');

					if(this.$login) {
						this.$login(loginData);
					}

					this.createUserDirectories().then(() => {
						return resolve(loginData);
					}).catch((error) => {
						return reject(error);
					});
				}).catch((error) => {
					console.warn('setted token', error);

					if(this.$unauthorized) {
						this.$unauthorized(error);
					}

					return reject(error);
				});
			});
		}

		return Promise.reject();
    }

    loginCredentials(server, username, password) {
        if(this.socketHelper) {
            username = username.toLowerCase();

			return this.socketHelper.getDatabaseHelper().query({
			    sql: "SELECT * FROM `users` WHERE `username`=? LIMIT 0,1",
                values: [username]
			}).then((data) => {
			    if(data.rows && data.rows[0] && PasswordHelper.compare(password, data.rows[0].password)) {
					let row = data.rows[0];

					if(row.username && row.id) {
						this.isLoggedIn = true;

						return this.jwtHelper.get(server, row.id, row.username).then((token) => {
							let loginData = {
								server: server,
								username: row.username,
								id: row.id,
								token: token
							};

							this.parseLoginInfo(loginData);

							if (this.$login) {
								this.$login(loginData);
							}

							return this.createUserDirectories().then(() => {
								return Promise.resolve(loginData)
							}).catch((error) => {
								return Promise.reject(error);
							});
                        });
					}
                }

                return Promise.reject();
			}).catch((error) => {
				if(this.$unauthorized) {
					this.$unauthorized();
				}
            });
        }

        return Promise.reject();
    }

    getDigesta(username, password) {
        return crypto.createHash('md5').update(`${username.toLowerCase()}:SabreDAV:${password}`).digest('hex');
    }

    on(type, callback) {
        switch (type) {
            case 'login':
                this.$login = callback;
                break;
            case 'unauthorized':
                this.$unauthorized = callback;
                break;
            default: break;
        }
    }

    parseLoginInfo(data) {
    	if(data.id && data.token) {
    		this.currentUser = this.socketHelper.getUserHelper().getUser(data.id);

    		if(this.currentUser) {
				this.username = this.currentUser.getUsername();
				this.token = data.token;
				this.server = data.server;
				this.id = this.currentUser.getId();

				if(this.socketHelper.getSocket)
					this.currentUser.addSocket( this.socketHelper.getSocket().id );
			}
		}
    }

    getId() {
        return this.id;
    }

    getServer() {
        return this.server;
    }

    getUsername() {
        return this.username;
    }

    getToken() {
        return this.token;
    }

	setToken(token) {
		this.token = token;
	}

	createUserDirectories() {
    	return new Promise((resolve, reject) => {

			let fileHelper = this.socketHelper.getFileHelper();

			if(!fileHelper.isAllowed(fileHelper.TYPE_PRIVATE)) return resolve();

			let rootDirectory = fileHelper.getUserDirectory();
			let privateFiles = fileHelper.getUserFileDirectory();
			let tempFiles = fileHelper.getUserTempDirectory();

			if (!fs.existsSync(rootDirectory)){
				fs.mkdirSync(rootDirectory);
			}

			if (!fs.existsSync(privateFiles)){
				fs.mkdirSync(privateFiles);
			}

			if (!fs.existsSync(tempFiles)){
				fs.mkdirSync(tempFiles);
			}

			return resolve();
		});
	}
}

module.exports = LoginHelper;