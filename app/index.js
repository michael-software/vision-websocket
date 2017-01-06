var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');

var LoginHelper = require('./utils/helper/LoginHelper.jsx');
var SocketHelper = require('./utils/helper/SocketHelper');

var __dirname = './public/';


try {
    fs.mkdirSync('temp/');
} catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
}


http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    let socketHelper = new SocketHelper(socket);
	let loginHelper = new LoginHelper(socketHelper);

    console.log('user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });


    loginHelper.on('login', (user) => {
        user.status = 200;
        socket.emit('loginstatus', user);

        socketHelper.register(loginHelper, user);
    });
    loginHelper.on('unauthorized', (data) => {
        socket.emit('loginstatus', {
			head: {
				status:401
			}
		});
    });



    socket.on('login', function(data) {
        if(data.server && data.bearer) {
			console.log('login with token');
            loginHelper.loginToken(data.server, data.bearer);
        } else if(data.server && data.username && data.password) {
            console.log('login with credentials');
            loginHelper.loginCredentials(data.server, data.username, data.password);
        }

        console.log('Login', data);
    })
});