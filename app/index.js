var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var LoginHelper = require('./utils/helper/LoginHelper.jsx');
var SocketHelper = require('./utils/helper/SocketHelper');

var __dirname = './public/';


http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    let loginHelper = new LoginHelper();

    console.log('user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });


    let socketHelper = new SocketHelper(socket);

    loginHelper.on('login', (user) => {
        user.status = 200;
        socket.emit('loginstatus', user);

        socketHelper.register(loginHelper, user);
    });
    loginHelper.on('unauthorized', (data) => {
        data.status = 401;
        socket.emit('loginstatus', data);
    });



    socket.on('login', function(data) {
        if(data.server && data.bearer) {
            loginHelper.loginToken(data.server, data.bearer);
        } else if(data.server && data.username && data.password) {
            loginHelper.loginCredentials(data.server, data.username, data.password);
        }

        console.log('Login', data);
    })
});