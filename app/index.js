var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var LoginHelper = require('./utils/login/LoginHelper.jsx');

var __dirname = './app/public/';

app.get('/', function(req, res){
    res.sendfile(__dirname + 'index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    let loginHelper = new LoginHelper();

    console.log('user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });


    loginHelper.on('login', (data) => {
        socket.emit('loginstatus', {status: 200});
    });
    loginHelper.on('unauthorized', (data) => {
        socket.emit('loginstatus', {status: 401});
    });



    socket.on('login', function(data) {
        loginHelper.login('##url##', data.bearer);

        console.log('Login', data);
    })
});