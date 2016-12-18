var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var LoginHelper = require('./utils/helper/LoginHelper.jsx');
var PluginHelper  = require('./utils/helper/PluginHelper.js');

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


    loginHelper.on('login', (user) => {
        user.status = 200;
        socket.emit('loginstatus', user);


        let pluginHelper = new PluginHelper(loginHelper);
        socket.on('plugins', (data) => {
            if(data == 'true') {
                pluginHelper.getPlugins(user).then((data) => {
                    socket.emit('plugins', data);
                });
            }
        });

        socket.on('plugin', (data) => {
            if(data && data.name) {
                pluginHelper.getPlugin(data.name, data.view, data.param).then((response) => {
                    socket.emit('plugin', {
                        request: data,
                        response: response
                    });
                });
            }
        });
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