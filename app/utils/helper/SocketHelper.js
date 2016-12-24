var PluginHelper  = require('./PluginHelper.js');
var SearchHelper  = require('./SearchHelper.js');

class SocketHelper {
    constructor(socket) {
        this.pluginHelper = new PluginHelper();
        this.searchHelper = new SearchHelper();
        this.socket = socket;


        socket.on('plugins', this.getPlugins.bind(this));

        socket.on('plugin', this.getPlugin.bind(this));

        socket.on('search', this.getSearch.bind(this));
    }

    register(loginHelper, user) {
        this.pluginHelper.setLoginHelper(loginHelper);
        this.searchHelper.setLoginHelper(loginHelper);
        this.user = user;
    }

    getPlugins(data) {
        if(data == 'true') {
            this.pluginHelper.getPlugins(this.user).then((data) => {
                this.socket.emit('plugins', data);
            });
        }
    }

    getPlugin(data) {
        console.log('requestPlugin', data);

        if(data && data.name) {
            this.pluginHelper.getPlugin(data.name, data.view, data.param).then((response) => {
                this.socket.emit('plugin', {
                    request: data,
                    response: response
                });
            });
        }
    }

    getSearch(data) {
        console.log(data);

        if(data && data.query) {
            this.searchHelper.getSearch(data.query).then((response) => {
                this.socket.emit('search', {
                    request: data,
                    response: response
                });
            });
        }
    }
}

module.exports = SocketHelper;