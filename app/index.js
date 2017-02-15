const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

const pluginLoader = require('./utils/helper/PluginHelper/pluginLoader.js');
const userLoader = require('./utils/helper/UserHelper/userLoader.js');
const LoginHelper = require('./utils/helper/LoginHelper.js');
const SocketHelper = require('./utils/helper/SocketHelper');

const ServerHelper = require('./utils/helper/ServerHelper');

const RestManager = require('./rest/RestManager.js');

var __dirname = './public/';


try {
    fs.mkdirSync('temp/');
} catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
}

let serverHelper = new ServerHelper();

serverHelper.init().then((data) => {
	if(data.config && data.userList && data.pluginList) {
		let serverConfig = data;
		let userList = data.userList;
		let pluginList = data.pluginList;


		let restManager = new RestManager(app, data);


		http.listen(3000, function () {
			console.info('\x1b[36m%s\x1b[0m', 'listening on *:3000');
		});

		io.on('connection', function (socket) {
			let socketHelper = new SocketHelper(socket, serverConfig);
			let loginHelper = socketHelper.getLoginHelper();

			console.info('\x1b[36m%s\x1b[0m', 'user connected');

			socket.on('disconnect', function () {
				if(loginHelper.currentUser)
					loginHelper.currentUser.removeSocket( socket.id );
				console.info('\x1b[36m%s\x1b[0m', 'user disconnected');
			});


			loginHelper.on('login', (user) => {
				user.status = 200;
				socket.emit('loginstatus', user);
			});
			loginHelper.on('unauthorized', (data) => {
				socket.emit('loginstatus', {
					head: {
						status: 401
					}
				});
			});


			socket.on('login', function (data) {
				if (data.server && data.bearer || data.authtoken) {
					console.log('	\x1b[33m%s\x1b[0m:', 'login with token');
					loginHelper.loginToken(data.server, data.bearer || data.authtoken);
				} else if (data.server && data.username && data.password) {
					console.log('	\x1b[33m%s\x1b[0m:', 'login with credentials');
					loginHelper.loginCredentials(data.server, data.username, data.password);
				}
			})
		});
	}
});