const fs            = require('fs');
const fetch         = require('node-fetch');
const FormData      = require('form-data');

const ConnectionHelper           = require('./ConnectionHelper.js');

const PluginHelper          = require('./PluginHelper/PluginHelper.js');
const SearchHelper          = require('./SearchHelper.js');
const UploadHelper          = require('./UploadHelper.js');
const NotificationHelper    = require('./NotificationHelper/NotificationHelper.js');
const UserHelper            = require('./UserHelper/UserHelper.js');
const LoginHelper           = require('./LoginHelper.js');

class SocketHelper extends ConnectionHelper {
    constructor(socket, serverConfig) {
        super(serverConfig);

        this.socket = socket;


        socket.on('plugins', this.getPlugins.bind(this));

        socket.on('plugin', this.getPlugin.bind(this));

        socket.on('search', this.getSearch.bind(this));

        socket.on('upload', this.upload.bind(this));

        socket.on('async', this.async.bind(this));

        socket.on('disconnect', this.disconnect.bind(this));
    }

    disconnect() {
        this.uploadHelper.removeAll();
    }

    getPlugins(data) {
        if(data == 'true' || data === true) {
            this.pluginHelper.getPluginList(this.getUserHelper().getCurrentUser()).then((data) => {
                this.socket.emit('plugins', data);
            }).catch((error) => {
				this.socket.emit('plugins', error.stack || error);
            });
        } else {

            let plugins = this.pluginHelper.getPlugins(); // TODO same code as in RestManager
			let pluginArray = [];

			for(let plugin of plugins) {
				pluginArray.push(plugin);
			}

			this.socket.emit('plugins', pluginArray);
        }
    }

    getPlugin(data) {
        if(data && data.name) {
            this.pluginHelper.getPlugin(data.name, data.view, data.param, data.formData).then((response) => {
                this.socket.emit('plugin', {
                    request: data,
                    response: response
                });
            }).catch((error) => {
                if(error instanceof Error) {
                    error = error.stack;
                }

				this.socket.emit('plugin', {
					request: data,
					response: {
					    head:{
					        status: 500
                        },
                        data: String(error)
					}
				});
            });
        }
    }

    getSearch(data) {
        if(data && data.query) {
            this.searchHelper.getSearch(data.query).then((response) => {
                this.socket.emit('search', {
                    request: data,
                    response: response
                });
            });
        }
    }

	getNotificationHelper() {
        return new NotificationHelper(this.socket, this.serverConfig, this.userHelper);
    }

    getSocket() {
        return this.socket;
    }

    upload(data) {
        let name = data.name;

        try {
            fs.mkdirSync('temp/' + this.getUserHelper().getCurrentUser().id);
        } catch(e) {
            if ( e.code != 'EEXIST' ) throw e;
        }

        let path = "temp/" + this.getUserHelper().getCurrentUser().id + "/" + data.id + "/";

        try {
            fs.mkdirSync(path);
        } catch(e) {
            if ( e.code != 'EEXIST' ) throw e;
        }

        fs.open(path + name, "a", 0o0755, (err, fd) => {
            if(!err) {
                fs.write(fd, data.data, 0, data.data.byteLength, 0, (error) => {
                    if(error == null)
                    fs.close(fd, () => {
                        this.uploadHelper.setUploaded(data.id, path + name);
                    });

                });
            }
        });
        /* TODO: callback helper as object (multiple instances/different users) */
    }

    async(obj) {
        if(obj.plugin && obj.action) {
            let formData = new FormData();
            formData.append('plugin', obj.plugin);
            formData.append('action', obj.action);

            if(obj.value)
                formData.append('value', obj.value);

            let header = {
                method: 'POST',
                headers: {
                    Authorization: 'bearer ' + this.loginHelper.getToken()
                },
                body: formData
            };

            fetch(this.loginHelper.getServer() + '/api/async.php', header).then((data) => {
                if(data.status != 200) {
                    throw new Error('Bad statusCode');
                }

                return data.text();
            }).then((data) => {
                console.log(data);
            }).catch((error) => {

            });
        }
    }
}

module.exports = SocketHelper;